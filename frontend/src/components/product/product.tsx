import { Button } from 'antd/es/radio'
import React, { useEffect, useState } from 'react'
import { HeartOutlined } from "@ant-design/icons"
import { BsCartPlusFill } from "react-icons/bs";
import { SwapOutlined } from "@ant-design/icons"
import { NavLink } from 'react-router-dom';
import "./product.css"
import { scrollToTop } from '../../config/scrollToTop';
import { useDispatch, useSelector } from 'react-redux';
import { selectProduct } from '../../slices/product';
import { IProduct } from '../../common/products';
const Product = (props: any) => {
    const lastViewProduct = JSON.parse(localStorage.getItem('lastViewProduct') || "[]");
    const productIndex = lastViewProduct.find((item: IProduct) => item._id === props?.product?._id)
    const handleViewProduct = () => {
        if (props?.product) {
            if (!productIndex) {
                lastViewProduct.push(props?.product);
            }
        }
        localStorage.setItem("lastViewProduct", JSON.stringify(lastViewProduct))
    };



    return (
        <div className="colum">
            <div className="img-product">
                <img src={props?.product?.image} alt="" />
            </div>
            <h2><NavLink onClick={() => {
                scrollToTop()
                handleViewProduct()
            }} to={"/products/" + props?.product?._id}>{props?.product?.name}</NavLink></h2>
            {/* <Button style={{ border: "1px solid yellow", borderRadius: "5px" }}><BsCartPlusFill rev={undefined} /> ADD TO CART</Button><br /> */}
            <div className="price">
                <del>{props?.product?.discount > 0 && <>{props?.product?.price?.toLocaleString("vi-VN",{ style: "currency", currency: "VND" })}</> }</del><strong> {(props?.product?.price - props?.product?.price * props?.product?.discount/100).toLocaleString("vi-VN",{ style: "currency", currency: "VND" })}</strong>
            </div>
            {/* <div className="hidden">
                <HeartOutlined className='heart' style={{ color: "#f12", border: "1px solid #f12", borderRadius: "50px", padding: "10px", marginRight: "10px" }} rev={undefined} />
                <SwapOutlined style={{ color: "#f12", border: "1px solid #f12", borderRadius: "50px", padding: "10px" }} rev={undefined} />
            </div> */}
            {props?.product?.discount > 0 && <p id='sale'>-{props?.product?.discount}%</p>}
        </div>
    )
}

export default Product