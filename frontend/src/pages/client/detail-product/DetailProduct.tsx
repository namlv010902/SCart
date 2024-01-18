import { Link, useParams } from "react-router-dom"
import "./detail-product.css"
import react, { useEffect, useState } from "react"
import { Progress } from "antd"
import { FacebookOutlined } from "@ant-design/icons"
import { ArrowRightOutlined, PlusOutlined, TwitterOutlined, MinusOutlined, YoutubeOutlined, InstagramOutlined } from "@ant-design/icons"
import Product from "../../../components/product/product"
import Rating from "../../../components/Rate/Rate"
import { useGetProductByIdQuery, useGetProductOutStandingQuery, useGetRelatedProductQuery } from "../../../service/product.service"
import { IProduct } from "../../../common/products"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAddToCartMutation, useGetCartQuery } from "../../../service/cart.service"
import { useDispatch, useSelector } from 'react-redux';
import LastViewProduct from "../../../components/lastViewProduct/LastViewProduct"
import { formatPrice } from "../../../config/formatPrice"
import SpecialProduct from "../../../components/specialProduct/SpecialProduct"
const DetailProduct = () => {

  const { id } = useParams()
  const { data, error } = useGetProductByIdQuery(id)
  const [quantity, setQuantity] = react.useState(1)
  const { data: relatedProducts } = useGetRelatedProductQuery(data?.data?.categoryId?._id)
  const [addToCart, { isSuccess, error: errorCart }] = useAddToCartMutation()
  const { data: cartDb, isSuccess: success } = useGetCartQuery();
  let cart = JSON.parse(localStorage.getItem("cart")!);
  const [dataCart, setData] = useState([]);
  const [dataRelated, setDataRelated] = useState([])
  const dispatch = useDispatch();
  const menu = [
    {
      name: "HOME", link: "/"
    },
    {
      name: "SHOP", link: "/products"
    },

  ]
  //check sp liên quan
  useEffect(() => {
    if (relatedProducts) {
      if (id) {
        const exist = relatedProducts?.data?.docs?.filter((p: IProduct) => p._id !== id)
        setDataRelated(exist)
      }
    }
  }, [relatedProducts, id])
  //get cart db
  useEffect(() => {
    if (success) {
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
    console.log("running..");

  }, [success]);

  //check dữ liệu trả về từ server
  useEffect(() => {
    if (isSuccess) {
      toast.success("Added cart successfully", {
        autoClose: 3000,
      })
    }
    if (errorCart && errorCart?.data?.message != "Login again please !") {
      toast.error(errorCart?.data?.message, {
        autoClose: 3000,
      })
      setQuantity(errorCart?.data?.maxQuantity);

    }
  }, [isSuccess, errorCart])

  const handleAddToCart = (e: any) => {
    e.preventDefault();
    const dataCart = {
      name: data?.data?.name,
      price: data?.data?.price,
      image: data?.data?.image,
      _id: data?.data?._id,
      quantity: parseInt(quantity),
    };

    if (success) {
      const dataCartDB = {
        _id: data?.data?._id,
        quantity: parseInt(quantity),
      };
      addToCart(dataCartDB)
      return
    }

    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const productIndex = cart?.find((item: any) => item._id == id)

    if (productIndex) {
      if (quantity > data?.data?.quantity - productIndex.quantity) {
        toast.error("Đã đạt tối đa số lượng mua!", {
          autoClose: 3000,
        })
        return
      }

      productIndex.quantity = productIndex.quantity + quantity
      localStorage.setItem("cart", JSON.stringify(cart));
    } else {
      cart.push(dataCart);
      localStorage.setItem("cart", JSON.stringify(cart));
    }
    toast.success("Added cart successfully", {
      autoClose: 3000,
    })
    setQuantity(1)

  };


  const handleQuantity = (value: number) => {
    console.log(value);
    if (isNaN(value)) {
      setQuantity(1)
      return
    }
    const productIndex = dataCart?.find((item: any) => item._id == id)
    if (productIndex) {
      if (value >= data?.data?.quantity) {
        const maxQuantity = data?.data?.quantity - productIndex?.quantity
        setQuantity(maxQuantity)
        return
      }

    }
    if (value >= data?.data?.quantity) {
      setQuantity(data?.data?.quantity)
      toast.error("The product quantity is not sufficient!")
      return
    }
    else {
      setQuantity(value)
    }
  }
  const handleIncrease = () => {
    const updatedQuantity = quantity + 1;
    if (updatedQuantity > data?.data?.quantity) {
      toast.error("The product quantity is not sufficient!")
      return
    }
    setQuantity(updatedQuantity);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      const updatedQuantity = quantity - 1;
      setQuantity(updatedQuantity);
    }

  };
  const price = formatPrice(data?.data?.price)
  const formatedPrice = formatPrice(data?.data?.price - data?.data?.price * data?.data?.discount / 100)
  return (
    <div>
      <div className="banner-detail" >
        <h1>{data?.data?.name}</h1>
      </div>
      <div className="menu-detail">
        {menu.map((item: any) => {
          return (
            <>
              <Link to={item.link}>{item.name}</Link> <ArrowRightOutlined rev={undefined} />
            </>
          )
        })}
        <Link to={"/categories/" + data?.data?.categoryId?._id}>{data?.data?.categoryId?.name} </Link>  <ArrowRightOutlined rev={undefined} />
        <Link to="#"> {data?.data?.name}</Link>
      </div>
      <main className="main-detail-product">
        <aside>
          <div className="item-aside">
            <div className="aside-title">
              <h6>SPECIAL PRODUCTS <img src="https://bizweb.dktcdn.net/100/439/653/themes/838421/assets/leaf.png?v=2?1640337155016" alt="" /></h6>
            </div>
            <SpecialProduct></SpecialProduct>
          </div>
          <div className="item-aside">
            <div className="aside-title">
              <h6>LAST VIEW PRODUCTS <img src="https://bizweb.dktcdn.net/100/439/653/themes/838421/assets/leaf.png?v=2?1640337155016" alt="" /></h6>
            </div>
            <LastViewProduct></LastViewProduct>
          </div>
        </aside>
        {!error ? <article>
          <div className="detail-product">

            <div className="detail-product-img">
              <img src={data?.data?.image} alt="" />
            </div>
            <div className="detail-product-body">

              <h1 className="product-name">{data?.data?.name} </h1>
              <p>SKU: {data?.data?._id} </p>
              <del>{data?.data?.discount > 0 && <>{price}</>}</del><strong> {formatedPrice}/Kg</strong>

              <hr className="hr-gray" />

              <form onSubmit={handleAddToCart}>
                <div className="quantity-add">
                  <input type="text" value={quantity} onChange={e => handleQuantity(e.target.value)} />
                  <div className="arrow">
                    <span onClick={handleIncrease}><PlusOutlined rev={undefined} /></span>
                    <span onClick={handleDecrease}><MinusOutlined rev={undefined} /></span>
                  </div>
                </div>

                {quantity == 0 ? <button disabled style={{ backgroundColor: "#777" }}>ADD TO CART</button> : <button>ADD TO CART</button>}
              </form>
              <div className="info-product">Stock:
                <Link to="#">{data?.data?.quantity}</Link>
              </div>
              <div className="info-product">Category:
                <Link to="#"> {data?.data?.categoryId?.name}</Link>
              </div>
              <div className="info-product">Brand:
                <Link to="#">HaGiang </Link>
              </div>
              <hr className="hr-gray" />
              <div className="share">
                Share:
                <p> <FacebookOutlined rev={undefined} /> </p>
                <p> <TwitterOutlined rev={undefined} /> </p>
                <p> <YoutubeOutlined rev={undefined} /> </p>
                <p> <InstagramOutlined rev={undefined} /> </p>
              </div>

            </div>
          </div>
          <div className="desc">
            <h3>DESCRIPTION</h3>
            <div className="progress">
              <Progress showInfo={false} percent={20} />
            </div>

            <div className="desc-content">
              <p>{data?.data?.desc}</p>

              <p className="desc-img">{data?.data?.desc}
                <img src="https://bizweb.dktcdn.net/100/431/449/themes/877121/assets/img-footer.png?1695378841384" alt="" />
              </p>
            </div>
          </div>
          <Rating id={id}></Rating>
          <div className="recommend-product">
            <h1>RELATED PRODUCTS <img src="https://bizweb.dktcdn.net/100/439/653/themes/838421/assets/leaf.png?v=2?1640337155016" alt="" /></h1>
            <div className="products"> {data?.data && dataRelated?.map((item: IProduct) => (
              <Product product={item}></Product>
            ))}
            </div>
          </div>

        </article> : <h3>PRODUCT NOT FOUND</h3>}


      </main>
     
    </div >
  )
}

export default DetailProduct