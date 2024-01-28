import React from 'react'
import { useGetAllCategoryQuery } from '../../services/category.service'
import { ICategory } from '../../common/category'
import "./categories.css"
import Slider from 'react-slick'
import { Link } from 'react-router-dom'
const Categories = () => {
  const {data} = useGetAllCategoryQuery()
  const settings = {
    
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };
  return (
    <div className='categories'>
       <Slider {...settings}>
      {data?.data?.docs?.map((item:ICategory)=>(
        <>
        <Link to={"/categories/"+item?._id} className="item-cate">
          <div className="img-cate">
            <img src={item?.image} alt="" />
          </div>
          <div className="name-cate">
            <strong>{item?.name}</strong>
            <p>{item?.products?.length} sản phẩm</p>
          </div>
        </Link>
        </>
      ))}
      </Slider>
    </div>
  )
}

export default Categories