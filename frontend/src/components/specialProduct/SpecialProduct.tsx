import React from 'react'
import { Link } from 'react-router-dom'
import { IProduct } from '../../common/products'
import { useGetProductOutStandingQuery } from '../../service/product.service'
import { scrollToTop } from '../../config/scrollToTop'

const SpecialProduct = () => {
  const { data: productOutStanding } = useGetProductOutStandingQuery()
  return (

    <div className="product-minimal">
      {productOutStanding?.data?.docs?.map((item: IProduct) => (
        <div className="product-minimal-colum">
          <div className="product-minimal-img">
            <img src={item.image} alt="" />
          </div>
          <div className="product-minimal-body">
            <Link onClick={()=>scrollToTop()} to={"/products/"+item._id}>{item.name}</Link>
            <div className="product-minimal-price"><del></del><strong>{item.price.toLocaleString("vi-VN",{
              style:"currency",currency:"VND"
              })}</strong></div>
          </div>
        </div>
      ))}

    </div>

  )
}

export default SpecialProduct