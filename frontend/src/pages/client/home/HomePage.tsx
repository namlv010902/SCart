import React, { useEffect } from 'react'
import Product from '../../../components/product/product'
import Blog from '../../../components/blog/blog'
import { Progress } from 'antd'
import "./home.css"
import Countdown from '../../../components/time'
import Banner from '../../../components/banner/banner'

import { IProduct } from '../../../common/products'
import { useGetNewProductQuery, useGetProductSaleQuery } from '../../../service/product.service'
import { Link } from 'react-router-dom'
import { scrollToTop } from '../../../config/scrollToTop'
import { formatPrice } from '../../../config/formatPrice'

const HomePage = () => {

  const { data, error, isLoading } = useGetNewProductQuery()
  const { data: dataSale } = useGetProductSaleQuery()
  // console.log(data?.data?.docs);

  return (
    <div>
      <div style={{ overflowX: "hidden", height: "530px" }}>
        <Banner></Banner>
      </div>

      <div style={{ padding: "30px 180px" }}>
        <h1 className='title' style={{ textAlign: "center", fontWeight: "400" }}><p>FLASH SALE</p><img src="https://bizweb.dktcdn.net/100/439/653/themes/838421/assets/leaf.png?v=2?1640337155016" alt="" /></h1>
        <div className="flash_sale">
          {dataSale?.data?.docs?.map((item: IProduct) =>{
          const priceCurrent = formatPrice(item.price)
          const priceSale =formatPrice(item.price - item.price * item.discount/100)
            return (
              <div className="flash_item">
              <div className="flash_image">
                <Link onClick={()=>scrollToTop()} to ={"/products/"+item._id}> <img src={item?.image} alt="" />
                </Link>
               
              </div>
              <div className="flash_content">
              <Link onClick={()=>scrollToTop()} to ={"/products/"+item._id}>   <h2>{item?.name}</h2>
                </Link>
             
                <del>{priceCurrent}</del><strong> {priceSale}</strong>
                <p style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div className="stock_sold">
                    <p>Already Sold: {item?.quantity}</p>
                  </div>
                  <div className="stock_available">
                    <p>Available: 999</p>
                  </div>
                </p>
                <Progress strokeWidth={17} showInfo={false} percent={60} size="default" status="exception" style={{ width: "300px" }} />
                <div className="countdown_time" >
                  <Countdown />
                </div>
              </div>
            </div>
          )
          })}



        </div>
        <h1 className='title' style={{ textAlign: "center", fontWeight: "400" }}><p>NEW PRODUCTS</p><img src="https://bizweb.dktcdn.net/100/439/653/themes/838421/assets/leaf.png?v=2?1640337155016" alt="" /></h1>
        <div className="products"> {data?.data?.docs?.map((item: IProduct) => (
          <Product product={item}></Product>
        ))}
        </div>

        {/* <Blog></Blog> */}
      </div>
    </div>
  )
}

export default HomePage