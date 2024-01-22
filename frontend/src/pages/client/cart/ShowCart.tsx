import React, { useEffect, useState, useMemo } from 'react';
import "./cart.css";
import { Steps } from "antd"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ArrowRightOutlined } from "@ant-design/icons";
import { NavLink } from 'react-router-dom';
import { HiOutlineX } from "react-icons/hi";
import { HiOutlineMinus, HiOutlinePlusSm } from "react-icons/hi";
import Swal from 'sweetalert2';
import { scrollToTop } from '../../../config/scrollToTop';
import { useGetCartQuery, useRemoveProductInCartMutation, useUpdateCartMutation } from '../../../service/cart.service';
import { formatPrice } from '../../../config/formatPrice';
import { IProduct } from '../../../common/products';
import { useGetOneProductMutation } from '../../../service/product.service';
import Step from '../../../components/Steps';
interface TypeProductInCart {
  _id: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
}
const ShowCart = () => {
  let cart = JSON.parse(localStorage.getItem("cart")!);
  const [data, setData] = useState([]);
  const { data: cartDb, isSuccess } = useGetCartQuery();
  const [updateCart, { error }] = useUpdateCartMutation();
  const [deleteProductInCart] = useRemoveProductInCartMutation()
  const [getProduct, { data: dataOneProduct }] = useGetOneProductMutation()

  useEffect(() => {
    if (isSuccess) {
      const products = cartDb?.body?.data?.products;
      const formatCartDb = products?.map((item: any) => ({
        _id: item?._id._id,
        name: item._id.name,
        price: item._id.price,
        quantity: item.quantity,
        image: item._id.image
      }));
      setData(formatCartDb);
    } else {
      setData(cart);
    }
    if (error) {
      toast.error(error?.data?.message, {
        autoClose: 3000,
      })
    }

  }, [cartDb, isSuccess, error]);

  const updateQuantity =  (id: string, quantity: any) => {
     getProduct(id)
    const updatedData = data.map((item: any) => {
      if (item._id === id) {
        if (quantity === "increase") {
          return {
            ...item,
            quantity: item.quantity + 1
          };
        }
        if (quantity === "decrease") {
          if (item.quantity - 1 > 0) {
            return {
              ...item,
              quantity: item.quantity - 1
            };
          } else {
            return {
              ...item,
              quantity: 1
            };
          }
        }
        if (quantity > 0) {
          console.log(cart);

          return {
            ...item,
            quantity: quantity
          };
        } else {
          return {
            ...item,
            quantity: 1
          };
        }
      }
      return item;
    });

    if (isSuccess) {
      const productIndex = cartDb?.body?.data?.products.find((item: any) => item._id._id == id)

      if (quantity == "increase" && productIndex) {
        quantity = productIndex.quantity + 1
      }
      if (quantity == "decrease" && productIndex) {
        quantity = productIndex.quantity - 1
      }
      const body = {
        _id: id,
        quantity
      };
      if (quantity > 0) {
        updateCart(body);
      }
    } else {
      setData(updatedData);
      localStorage.setItem("cart", JSON.stringify(updatedData));
    }
  };

  const removeProduct = (id: string) => {
    const body = {
      _id: id
    }
    if (cartDb?.body?.data.products) {
      deleteProductInCart(body)
      return
    }
    const updatedData = cart.filter((item: any) => item._id != id)
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result: any) => {
      if (result.isConfirmed) {

        setData(updatedData);
        localStorage.setItem("cart", JSON.stringify(updatedData));

        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
      }
    });
  }

  return (
    <div>
      <div className="menu-detail">
        <NavLink to="/">HOME </NavLink>
        <ArrowRightOutlined rev={undefined} />
        SHOPPING CART
      </div>
      <div className="shopping-cart">
        {data && data.length > 0 ?
          <>
            <Step number = {0} />
            <table>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data?.map((item: any, index: number) => {
                  const price = formatPrice(item.price)
                  const subTotalPrice = formatPrice(item.price * item.quantity)
                  return (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>
                        <div className='img-in-cart'>
                          <img src={item.image} alt="" />
                          {item.name}
                        </div>

                      </td>
                      <td>{price}</td>
                      <td id='quantity'>
                        <span>
                          <HiOutlineMinus
                            onClick={() => updateQuantity(item._id, "decrease")}
                          />
                        </span>
                        <input
                          id='update-quantity'
                          defaultValue={item.quantity}
                          value={item.quantity}
                          onChange={(e: any) => updateQuantity(item._id, parseInt(e.target.value))}
                        />
                        <span>
                          <HiOutlinePlusSm
                            onClick={() => updateQuantity(item._id, "increase")}
                          />
                        </span>
                      </td>
                      <td>{subTotalPrice}</td>
                      <td id='remove-product-in-cart'><HiOutlineX onClick={() => removeProduct(item._id)} /></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <div className="checkout">
              <NavLink onClick={() => scrollToTop()} to="/checkout"><button >Checkout</button></NavLink>
            </div>
          </>
          : <h3>The shopping empty!</h3>
        }

      </div>

    </div>
  );
};

export default ShowCart;