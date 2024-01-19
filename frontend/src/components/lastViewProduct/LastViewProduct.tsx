import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { IProduct } from '../../common/products'
import { scrollToTop } from '../../config/scrollToTop'

const LastViewProduct = () => {
    const [data, setData] = useState<IProduct[]>([])

    const lastViewProduct = JSON.parse(localStorage.getItem('lastViewProduct')!) || []

    useEffect(() => {
        setData(lastViewProduct)
    }, [])
    
    // console.log("current",data);
    const dataFormat = data.slice(0,4).reverse();
    // console.log("format",dataFormat);
    return (
        <>
            <div className="product-minimal">
                {dataFormat?.map((item: IProduct) => (
                    <div className="product-minimal-colum">
                        <div className="product-minimal-img">
                            <img src={item?.image} alt="" />
                        </div>
                        <div className="product-minimal-body">
                            <Link onClick={()=>scrollToTop()} to={"/products/" + item?._id}>{item?.name}</Link> <br />
                            <em>2024-01-09 16:11:57</em>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default LastViewProduct