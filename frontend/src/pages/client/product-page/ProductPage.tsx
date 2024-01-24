import { ArrowRightOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import "./product.css"
import { useGetProductOutStandingQuery, useSortProductMutation, useFilterPriceMutation } from '../../../services/product.service'
import { IProduct } from '../../../common/products'
import { Select, Slider, PaginationProps, Pagination } from "antd"
import Product from '../../../components/product/product'
import { useGetAllProductQuery } from '../../../services/product.service'
import { useGetAllCategoryQuery, useGetCategoryByIdMutation } from '../../../services/category.service'
import { ICategory } from '../../../common/category'
import LastViewProduct from '../../../components/lastViewProduct/LastViewProduct'
import SpecialProduct from '../../../components/specialProduct/SpecialProduct'
import Loading from '../../../components/Loading'

const ProductPage = () => {
    const { data: productOutStanding } = useGetProductOutStandingQuery()
    const { data, error, isLoading } = useGetAllProductQuery()
    const [sort, { data: dataSort, isSuccess }] = useSortProductMutation()
    const [products, setProducts] = useState<IProduct[]>()
    const { data: categories } = useGetAllCategoryQuery()
    const [getCateById, { data: cateById, isSuccess: successCate }] = useGetCategoryByIdMutation()
    const [activeItemId, setActiveItemId] = useState<string>();
    const [filterPrice, { data: dataFilter, isSuccess: successFilter }] = useFilterPriceMutation()
    const [pageSize, setPageSize] = useState(9);
    const [currentPage, setCurrentPage] = useState(1);
    const menu = [
        {
            name: "HOME", link: "/"
        },
        {
            name: "SHOP", link: "/produtcs"
        },

    ]
    const handleClick = (itemId: string) => {
        console.log(itemId);
        setActiveItemId(itemId);
        getCateById(itemId)
    };

    console.log(activeItemId);
    useEffect(() => {
        if (isSuccess) {
            setProducts(dataSort?.data?.docs);
            setCurrentPage(1); // Reset về trang đầu tiên khi sắp xếp
            return;
        }
        if (successFilter) {
            setProducts(dataFilter?.data?.docs);
            setCurrentPage(1); // Reset về trang đầu tiên khi lọc
            return;
        }
        setProducts(data?.data?.docs);
    }, [isSuccess, data, successFilter, currentPage]);
    useEffect(() => {
        if (successCate) {
            setProducts(cateById?.data?.products)
        }
    }, [successCate])

    const handleSort = (value: string) => {
        sort(value)
    }
    const handleFilterPrice = (value: any) => {
        console.log(value);
        filterPrice(value)
    }
    console.log(activeItemId);

    const onChange: PaginationProps['onChange'] = (page) => {
        setCurrentPage(page);
    };
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentProducts = products?.slice(startIndex, endIndex);
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
                        {isLoading ? <Loading /> :<>
                        {categories?.data?.docs?.map((item: ICategory) => {
                            console.log(item._id == activeItemId);
                            return (
                                <>
                                    <Link
                                        key={item._id}
                                        onClick={() => handleClick(item._id)}
                                        className={`${activeItemId ? (item._id == activeItemId ? 'active' : 'noActive') : 'noActive'}`}
                                        to="#"
                                    >
                                        {item?.name}
                                    </Link></>
                            )})}
                        </> }              
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
                        {isLoading ? <Loading /> :<SpecialProduct /> }
                        
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
                        <strong >Result: {products?.length} products</strong>
                        <Select
                            defaultValue="Sắp xếp theo giá"
                            style={{ width: 200 }}
                            onChange={handleSort}
                            options={options}
                        />
                    </div>
                    {isLoading ? <Loading /> : <div className="products" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
                        {currentProducts?.map((item: IProduct) => (
                            <Product product={item}></Product>
                        ))}
                    </div>}
                    <div className="pagination" style={{ textAlign: "center" }}>
                        <Pagination current={currentPage} onChange={onChange} total={products?.length} pageSize={pageSize} />
                    </div>
                </article>
            </main>
        </div >
    )
}

export default ProductPage