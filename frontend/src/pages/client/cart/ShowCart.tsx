import React, { useEffect, useState, useMemo } from 'react';
import "./cart.css";
import { Steps } from "antd"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ArrowRightOutlined } from "@ant-design/icons";
import { NavLink } from 'react-router-dom';
import { HiOutlineX } from "react-icons/hi";
import { HiOutlineMinus, HiOutlinePlusSm } from "react-icons/hi";
import Swal from 'sweetalert2';
import { scrollToTop } from '../../../config/scrollToTop';
import { useGetCartQuery, useRemoveProductInCartMutation, useUpdateCartMutation } from '../../../services/cart.service';
import { formatPrice } from '../../../config/formatPrice';
import { IProduct } from '../../../common/products';
import { useGetOneProductMutation } from '../../../services/product.service';
import Step from '../../../components/Steps';
import Loading from '../../../components/Loading';
import { useDispatch, useSelector } from 'react-redux';
import { removeProductInCart, selectCart, updateProductQuantity } from '../../../slices/cartLocal';
import { createAsyncThunk } from '@reduxjs/toolkit';



const ShowCart = () => {
  const cart = useSelector(selectCart);
  const [data, setData] = useState([]);
  const { data: cartDb, isSuccess, isLoading } = useGetCartQuery();
  const [updateCart, { error }] = useUpdateCartMutation();
  const [deleteProductInCart] = useRemoveProductInCartMutation()
  const [getProduct, { data: dataOneProduct, isSuccess: getSuccess }] = useGetOneProductMutation()
  const [quantityValue, setQuantityValue] = useState(0)
  const [dataUpdate, setDataUpdate] = useState({})
  const dispatch = useDispatch()
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

  }, [ isSuccess, error, cart]);

  console.log("maxQuantity: ",quantityValue);
  const updateQuantity = async (id: string, quantity: any) => {
    await getProduct(id)
    if (isSuccess) {
      const productIndex = cartDb?.body?.data?.products.find((item: any) => item._id._id == id)
      if (quantity == "asc" && productIndex) {
        quantity = productIndex.quantity + 1
      }
      if (quantity == "desc" && productIndex) {
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
      const data = {
        _id: id,
        quantity,
        maxQuantity: quantityValue
      }
      dispatch(updateProductQuantity(data))
     
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
    dispatch(removeProductInCart(id))
  }

  return (
    <div style={{ minHeight: "80vh" }}>
      <div className="menu-detail">
        <NavLink to="/">HOME </NavLink>
        <ArrowRightOutlined rev={undefined} />
        SHOPPING CART
      </div>
      {isLoading ? <Loading /> : <div className="shopping-cart">
        {data && data.length > 0 ?
          <>
            <Step number={0} />
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
                            onClick={() => updateQuantity(item._id, "desc")}
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
                            onClick={() => updateQuantity(item._id, "asc")}
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
          : <h3>The shopping cart empty!</h3>
        }

      </div>

      }

    </div>
  );
};

export default ShowCart;