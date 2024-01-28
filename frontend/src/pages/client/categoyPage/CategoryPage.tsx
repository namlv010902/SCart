import { ArrowRightOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import "../productsPage/product.css"
import { useGetProductOutStandingQuery, useSortProductMutation, useFilterPriceMutation } from '../../../services/product.service'
import { IProduct } from '../../../common/products'
import { Select, Slider, PaginationProps, Pagination } from "antd"
import Product from '../../../components/product/product'
import { useGetAllProductQuery } from '../../../services/product.service'
import { useGetAllCategoryQuery, useGetCategoryByIdMutation, useGetCategoryQuery } from '../../../services/category.service'
import { ICategory } from '../../../common/category'
import LastViewProduct from '../../../components/lastViewProduct/LastViewProduct'
import SpecialProduct from '../../../components/specialProduct/SpecialProduct'
import Loading from '../../../components/Loading'

const CategoryPage = () => {
    const { data, error, isLoading } = useGetAllProductQuery()
    const [sort, { data: dataSort, isSuccess }] = useSortProductMutation()
    const [products, setProducts] = useState<IProduct[]>()
    const { data: categories } = useGetAllCategoryQuery()
    const { id } = useParams()
    const { data: cateById, isSuccess: successCate }= useGetCategoryQuery(id)
    const [activeItemId, setActiveItemId] = useState<string>();
    const [filterPrice, { data: dataFilter, isSuccess: successFilter }] = useFilterPriceMutation()

    const menu = [
        {
            name: "HOME", link: "/"
        },
        {
            name: "SHOP", link: "/produtcs"
        },

    ]
    const handleClick = (itemId: string) => {
        setActiveItemId(itemId);
       
    };
    
    useEffect(() => {
        console.log("id", id);
        setProducts(cateById?.data?.products)
    }, [id,cateById])
   

    const handleSort = (value: string) => {
        sort(value)
    }
    const handleFilterPrice = (value: any) => {
        console.log(value);
        filterPrice(value)
    }

    const options = [
        { label: 'Giảm dần', value: 'desc' },
        { label: 'Tăng dần', value: 'asc' },
    ]

    return (
        <div>
            <div className="banner-product" >
                <h1>SHOP</h1>
            </div>
            <div className="menu-detail" >
                {menu.map((item: any) => {
                    return (
                        <>
                            <Link to={item.link}>{item.name}</Link> <ArrowRightOutlined rev={undefined} />
                        </>
                    )
                })}
            </div>

            <main className="main-detail-product">
                <aside>
                    <div className="item-aside">
                        <div className="aside-title">
                            <h6>CATEGORIES <img src="https://bizweb.dktcdn.net/100/439/653/themes/838421/assets/leaf.png?v=2?1640337155016" alt="" /></h6>
                        </div>
                        {isLoading ? <Loading /> : <>
                            {categories?.data?.docs?.map((item: ICategory) => {
                                // console.log(item._id == activeItemId);
                                return (
                                    <>
                                        <Link
                                            key={item._id}
                                            onClick={() => handleClick(item._id)}
                                            className={`${id ? (item._id == id ? 'active' : 'noActive') : 'noActive'}`}
                                            to={"/categories/" + item._id}
                                        >
                                            {item?.name}
                                        </Link></>
                                )
                            })}
                        </>}
                        <div className="product-minimal">
                        </div>
                    </div>
                    <div className="item-aside">
                        <div className="aside-title">
                            <h6>FILTER BY PRICE <img src="https://bizweb.dktcdn.net/100/439/653/themes/838421/assets/leaf.png?v=2?1640337155016" alt="" /></h6>
                        </div>
                        <Slider onChange={(e: any) => handleFilterPrice(e)} max={1000000} defaultValue={[20000, 500000]} range={{ draggableTrack: true }} />
                    </div>
                    <div className="item-aside">
                        <div className="aside-title">
                            <h6>SPECIAL PRODUCTS <img src="https://bizweb.dktcdn.net/100/439/653/themes/838421/assets/leaf.png?v=2?1640337155016" alt="" /></h6>
                        </div>
                        {isLoading ? <Loading /> : <SpecialProduct />}

                    </div>
                    <div className="item-aside">
                        <div className="aside-title">
                            <h6>LAST VIEW PRODUCTS <img src="https://bizweb.dktcdn.net/100/439/653/themes/838421/assets/leaf.png?v=2?1640337155016" alt="" /></h6>
                        </div>
                        <LastViewProduct></LastViewProduct>
                    </div>
                </aside>
                <article className='article-productPage'>
                    <div className="sort-product">
                        <strong >Result: {cateById?.data?.products?.length} products</strong>
                        <Select
                            defaultValue="Sắp xếp theo giá"
                            style={{ width: 200 }}
                            onChange={handleSort}
                            options={options}
                        />
                    </div>
                    {isLoading ? <Loading /> : <div className="products" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
                        {products?.map((item: IProduct) => (
                            <Product product={item}></Product>
                        ))}
                    </div>}

                </article>
            </main>
        </div >
    )
}

export default CategoryPage