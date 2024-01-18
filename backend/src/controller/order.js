import Order from "../models/order"
import checkoutValidate from "../schema/checkout"
import Cart from "../models/cart"
import User from "../models/user"
import { CANCELLED_ORDER, ORDERS, PENDING_ORDER } from "../config/constants"
export const createOrder = async (req, res) => {
    try {
        const { error } = checkoutValidate.validate(req.body)
        const user = req.user
        if (error) {
            return res.status(400).json({
                message: error.details.map(item => item.message)
            })
        }
        if (user != null) {
            req.body.userId = user._id
        }
        const order = await Order.create(req.body)
        if (order && user != null) {
            await Cart.findOneAndUpdate({ userId: req.user._id }, { products: [] })
            await User.findByIdAndUpdate(req.user._id, { address: req.body.address })
        }
        return res.status(201).json({
            message: "Order created successfully",
            data: order
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}
export const getOrdersForMember = async (req, res) => {
    try {
        const userId = req.user._id
        const data = await Order.find({ userId })

        return res.status(200).json({
            message: "Get orders successfully",
            data
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}
export const detailOrder = async (req, res) => {
    try {
        const data = await Order.findById(req.params.id)

        return res.status(200).json({
            message: "Get order successfully",
            data
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}
export const cancelledOrder = async (req, res) => {
    try {
        const data = await Order.findById(req.params.id)
        if(data.status != PENDING_ORDER){
            return res.status(400).json({
                message: "Đơn hàng này không được phép hủy!",
            })
        }
         await Order.findByIdAndUpdate(req.params.id, { status: CANCELLED_ORDER })
       
        return res.status(200).json({
            message: "Cancelled order successfully",

        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}
export const getAllOrders = async (req, res) => {
    const {
        _page = 1,
        _order = "desc",
        _limit = 999,
        _sort = "createdAt",
        _q = "",
    } = req.query
    const options = {
        page: _page,
        limit: _limit,
        sort: {
            [_sort]: _order == "desc" ? -1 : 1,
        },
    }
    try {
        const order = await Order.paginate({}, options);
        return res.status(200).json({
            message: "Get orders",
            data: order,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

export const updateOrder = async (req, res) => {
    try {
        const validate = ORDERS.includes(req.body.status)
        if (!validate) {
            return res.status(400).json({
                message: "Status invalid!",

            })
        }
        const currentOrder = await Order.findById(req.params.id);
        const currentStatusIndex = ORDERS.indexOf(currentOrder.status);
        const newStatusIndex = ORDERS.indexOf(req.body.status);
        if (newStatusIndex != currentStatusIndex + 1) {
            return res.status(401).json({
                message: "Trạng thái đơn hàng update phải theo tuần tự!",
            });
        }
        const data = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status })

        return res.status(200).json({
            message: "Get order successfully",
            data
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}