import mongoose from "mongoose"
import Cart from "../models/cart"
import Product from "../models/product"
import { cartDB } from "../schema/cart"

//Thêm sp vào giỏ hàng
export const addToCart = async (req, res) => {
    try {
        const { error } = cartDB.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(401).json({
                status: 401,
                message: error.details.map((error) => error.message),
            });
        }
        const userId = req.user._id;
        const { _id, quantity } = req.body;

        const checkProduct = await Product.findById(_id);

        if (!checkProduct) {
            return res.status(404).json({
                status: 404,
                message: "Product not found",
            });
        }
        // Check sl 
        if (quantity <= 0) {
            return res.status(401).json({
                message: "Please check the quantity again!"
            })
        }

        let cartExist = await Cart.findOne({ userId })

        //Trong kho hết hàng
        if (checkProduct.quantity == 0) {
            return res.status(400).json({
                message: "The product is out of stock"
            })
        }
        //Check số lượng sp mua lớn hơn số lượng trong kho
        if (quantity > checkProduct.quantity) {
            return res.status(401).json({
                message: "The quantity is not sufficient!",
                maxQuantity: checkProduct.quantity
            })
        }
        if (cartExist) {
            const productExits = cartExist.products.find(item => item._id == _id)
            //Check xem sl sp gửi lên vs cân có trong giỏ hàng có lớn hơn sl trong kho ko
            if (productExits) {
                //Sl trong giỏ hàng == vs trong kho
                if (productExits.quantity == checkProduct.quantity) {
                    return res.status(401).json({
                        message: "Has reached the maximum!",
                    })
                }
                if (quantity + productExits.quantity > checkProduct.quantity) {
                    return res.status(401).json({
                        message: "The quantity is not sufficient!",
                        maxQuantity: checkProduct.quantity - productExits.quantity
                    })
                }

            }
        }

        // check xem người dùng đã có giỏ hàng chưa
        let data = null;
        if (!cartExist) {
            // nếu chưa có => Tạo luôn
            cartExist = await Cart.create({
                userId,
                products: [
                    {
                        _id,
                        quantity,
                    },
                ],
            });
            data = cartExist;
        } else {
            // người dùng đã có giỏ hàng: check xem sp đó có trong giỏ hàng chưa
            const productExist = cartExist.products.find(
                (item) => item._id == _id
            );

            if (!productExist) {
                // nếu chưa thì add sp đó vào giỏ hàng
                cartExist.products.push({
                    _id,
                    quantity,
                });


            } else {
                // sản phẩm đã có trong giỏ hàng: cập nhật lại số lượng
                productExist.quantity += quantity;
            }
            data = await cartExist.save();

        }

        // Tính tổng tiền
        const cart = await Cart.findByIdAndUpdate(data._id, { new: true })
        return res.status(200).json({
            message: "Add to cart successfully",
            body: { data: cart },
            status: 200,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message,
        });
    }
};

//Update số lượng
export const updateProductQuantityInCart = async (req, res) => {
    try {
        const { quantity, _id } = req.body
        const userId = req.user._id

        let cart = null

        //Check sl lớn hơn 0
        if (quantity <= 0) {
            return res.status(401).json({
                message: "Please check the quantity again!"
            })
        }
        const checkProduct = await Product.findById(_id)
        let data = await Cart.findOne({ userId }).populate("products._id")

        //Trong kho hết hàng
        if (checkProduct.quantity == 0) {
            return res.status(401).json({
                message: "The product is out of stock"
            })
        }
        //Check cân gửi lên lớn hơn tổng cân trong kho
        if (quantity > checkProduct.quantity) {
            data = await Cart.findOneAndUpdate(
                { userId, "products._id": _id },
                {
                    $set: {
                        "products.$.quantity": checkProduct.quantity
                    }
                }, { new: true })

            cart = await Cart.findByIdAndUpdate(data._id, { new: true })
            return res.status(400).json({
                status: 400,
                message: "The quantity is not sufficient!",
                maxQuantity: checkProduct.quantity,
                body: { data }
            })
        }
        data = await Cart.findOneAndUpdate(
            { userId, "products._id": _id },
            {
                $set: {
                    "products.$.quantity": quantity
                }
            }, { new: true })



        cart = await Cart.findByIdAndUpdate(data._id, { new: true })
        return res.status(200).json({
            status: 200,
            message: "Update product quantity successfully",
            body: { data: cart }
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message,
        });
    }
}

// Lấy giỏ hàng
export const getCart = async (req, res) => {
    try {

        let data = await Cart.findOne({ userId: req.user._id }).populate("products._id")
        const errors = [];
        let cart = null
        if (data && data.products.length > 0) {
            for (let item of data.products) {
                const productExist = await Product.findById(item._id);
                // TH1: Nếu sp trong giỏ hàng ko còn tồn tại
                if (!productExist) {
                    // => Xóa nó khỏi cart
                    data = await Cart.findOneAndUpdate(
                        { userId: req.user._id, "products._id": item._id },
                        {
                            $pull: {
                                products: {
                                    _id: item._id
                                },
                            }
                        },
                        { new: true }
                    );

                    cart = await Cart.findByIdAndUpdate(data._id, { new: true })
                   
                    errors.push({
                        name: item.name,
                        message: "Product is no longer available!",
                    });
                } else {
                    //TH2: nếu sp đã hết hàng
                    if (productExist.quantity == 0) {
                        data = await Cart.findOneAndUpdate(
                            { userId: req.user._id, "products._id": item._id },
                            {
                                $pull: {
                                    products: {
                                        _id: item._id
                                    },
                                }
                            },
                            { new: true }
                        );

                        cart = await Cart.findByIdAndUpdate(data._id, { new: true })
               
                        errors.push({
                            name: item.name,
                            message: "Product is currently out of stock!",
                        });
                    }
                    // TH3: nếu trong kho ko đủ sl update lại bằng max sl có thể mua
                    if (productExist.quantity > 0 && item.quantity > productExist.quantity) {
                        data = await Cart.findOneAndUpdate(
                            { userId: req.user._id, "products._id": item._id },
                            {
                                $set: {
                                    "products.$.quantity": productExist.quantity
                                }
                            },
                            { new: true }
                        );
                        errors.push({
                            name: item.name,
                            maxQuantity: productExist.quantity,
                            message: "The quantity is not sufficient!",
                        });
                    }
                }
            }

            cart = await Cart.findByIdAndUpdate(data._id, { new: true })
   
        } else {
            return res.status(200).json({
                status: 200,
                message: "Cart empty",
                body: { data: {} }
            });
        }
       
        if (errors.length > 0) {
            return res.status(400).json({
                status: 400,
                message: "Errors in the cart",
                body: { errors, data: cart }
            });
        }
    
        return res.status(200).json({
            status: 200,
            message: "Get cart successfully",
            body: { data }
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message,
        });
    }
}
//Xóa 1 sp (.) giỏ hàng
export const removeOneProductInCart = async (req, res) => {
    try {

        let cart = null
        const data = await Cart.findOneAndUpdate({ userId: req.user._id, "products._id": req.body._id },
            {
                $pull: {
                    products: { _id: req.body._id }
                }
            }, { new: true })
        if (!data) {
            return res.status(401).json({
                status: 401,
                message: "Remove product in cart failed",
            });
        }
        if (data.products.length == 0) {
            return res.status(201).json({
                status: 201,
                message: "Cart empty",
                body: { data: [] }
            });
        }

        cart = await Cart.findByIdAndUpdate(data._id, { new: true }).populate("products._id")
        return res.status(200).json({
            status: 200,
            message: "Remove product in cart successfully",
            body: { data: cart }
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message,
        });
    }
}

//Xóa all sp (.) giỏ hàng
export const removeAllProductInCart = async (req, res) => {
    try {
        const data = await Cart.findOneAndUpdate({ userId: req.user._id },
            {
                products: []
            }, { new: true })

        return res.status(200).json({
            status: 200,
            message: "Cart empty",
            // body: { data}
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message,
        });
    }
}

// //Check cart local
// export const cartLocal = async (req, res) => {
//     try {
//         let totalPayment = 0;
//         const errors = [];
//         const products = req.body.products;
//         const { error } = cartValid.validate(req.body, { abortEarly: false })
//         if (error) {
//             return res.status(401).json({
//                 status: 401,
//                 message: error.details.map((error) => error.message),
//             });
//         }
//         for (let item of products) {
//             const prd = await Product.findById(item._id._id);
//             if (!prd) {
//                 errors.push({
//                     _id: item._id._id,
//                     name: item._id.name,
//                     message: "Product is not exsit!",
//                 });
//             } else {
//                 if (item._id.price !== prd.price - prd.price * prd.discount / 100) {
//                     errors.push({
//                         _id: prd._id,
//                         price: prd.price - prd.price * prd.discount / 100,
//                         name: prd.name,
//                         message: `Invalid price for product!`,
//                     });
//                 }

//                 if (item._id.name !== prd.name) {
//                     errors.unshift({
//                         _id: prd._id,
//                         name: prd.name,
//                         invalid: item._id.name,
//                         message: "Invalid product name!"
//                     });
//                 }
//                 if (!new mongoose.Types.ObjectId(item._id.originId._id).equals(prd.originId)) {
//                     await prd.populate("originId")
//                     errors.push({
//                         _id: prd._id,
//                         originId: prd.originId._id,
//                         originName: prd.originId.name,
//                         name: prd.name,
//                         message: "Invalid product origin!",
//                     });
//                 }

//                 if (item._id.images[0].url !== prd.images[0].url) {
//                     errors.push({
//                         _id: prd._id,
//                         image: prd.images[0].url,
//                         name: prd.name,
//                         message: "Invalid product image!",
//                     });
//                 }

//                 if (item.weight <= 0) {
//                     errors.push({
//                         _id: prd._id,
//                         weight: item.weight,
//                         name: prd.name,
//                         message: "Invalid product weight!",
//                     });
//                 }
//                 const currentTotalWeight = prd.shipments.reduce(
//                     (accumulator, shipment) => accumulator + shipment.weight, 0);
//                 if (prd.shipments.length === 0) {
//                     errors.push({
//                         _id: prd._id,
//                         name: prd.name,
//                         message: "The product is currently out of stock!",
//                     });
//                 } else if (item.weight > currentTotalWeight) {
//                     errors.push({
//                         _id: prd._id,
//                         name: prd.name,
//                         message: "Insufficient quantity of the product in stock!",
//                         maxWeight: currentTotalWeight,
//                     });
//                 }


//             }


//         }

//         if (errors.length > 0) {
//             return res.status(400).json({
//                 status: 400,
//                 message: "Error",
//                 body: { error: errors },
//             });
//         }

//         return res.status(200).json({
//             status: 200,
//             message: "Valid",
//             body: { data: true },
//         });
//     } catch (error) {
//         return res.status(500).json({
//             status: 500,
//             message: error.message,
//         });
//     }
// };