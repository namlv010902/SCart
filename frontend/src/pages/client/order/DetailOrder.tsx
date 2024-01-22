import { Link, useParams } from "react-router-dom"
import { useCancelledOrderMutation, useConfirmOrderMutation, useDetailOrderQuery } from "../../../service/order.service"
import "./order.css"
import { ArrowRightOutlined } from "@ant-design/icons"
import { formatPrice } from "../../../config/formatPrice"
import { IProduct } from "../../../common/products"
import { Button, Input, Modal, Rate } from "antd"
import { DONE_ORDER, PENDING_ORDER, PROCESS_ORDER, SUCCESS_ORDER } from "../../../constants/order"
import { useEffect, useState } from "react"
import { useCreateEvaluationMutation } from "../../../service/evaluation.service"
import { toast } from "react-toastify"

const DetailOrder = () => {
  const [cancelledOrder] = useCancelledOrderMutation()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { id } = useParams()
  const { data } = id ? useDetailOrderQuery(id) : useDetailOrderQuery("")
  const [content, setContent] = useState("")
  const [rate, setRate] = useState(1)
  const [idProduct, setIdProduct] = useState("")
  const [confirm] = useConfirmOrderMutation()

  const [createEvaluation, { isSuccess, error }] = useCreateEvaluationMutation()
  const formatTime = new Date(data?.data?.createdAt).toLocaleDateString()
  const totalPayment = formatPrice(data?.data?.totalPayment)
  const handleCancelledOrder = () => {
    if (window.confirm("Hủy đơn hàng?") && id) {
      cancelledOrder(id)
    }
  }
  useEffect(() => {
    if (isSuccess) {
      setIsModalOpen(false)
      toast.success("Đánh giá thành công")
      return
    }
    if (error) {
      toast.error(error?.data?.message)
    }
  }, [isSuccess, error])

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onHandleRating = () => {
    const body = {
      rate,
      content,
      productId: idProduct,
      orderId: id,
      customerName: data?.data?.customerName
    }
    console.log(body);
    createEvaluation(body);
  }


  return (
    <div>
      <div className="menu-detail">
        <Link to="/">HOME </Link>
        <ArrowRightOutlined rev={undefined} />
        <Link to="/orders"> ORDER</Link>
      </div>
      <div className="order-details">

        <h1 className="title-order">Chi tiết đơn hàng</h1>
        <div className="detailInfo">
          <div className="order-info">
            <h2>Mã đơn hàng: {data?.data?.invoiceId}</h2>
            <p>Ngày đặt hàng: {formatTime}</p>
            <p>Tổng giá trị đơn hàng: {totalPayment}</p>
            <p>Trạng thái đơn hàng: {data?.data?.status}</p>
            <p>Trạng thái thanh toán: {data?.data?.pay ? "Đã thanh toán" : "Chưa thanh toán"}</p>
          </div>
          <div className="shipping-info">
            <h2>Thông tin giao hàng</h2>
            <p>Tên người nhận: {data?.data?.customerName}</p>
            <p>Địa chỉ: {data?.data?.address}</p>
            <p>Số điện thoại: {data?.data?.phoneNumber}</p>
          </div>
        </div>
        <div className="order-items">
          <h2>Sản phẩm</h2>
          <ul>
            {data?.data?.products?.map((item: IProduct) => {
              const price = formatPrice(item.price)
              return (
                <li>
                  <div className="item">
                    <img src={item.image} alt="Product" />
                    <div className="item-info">
                      <h3> <Link style={{ color: "#3b9048", textDecoration: "none",fontWeight:"500" }} to={"/products/" + item._id} >{item.name}</Link> </h3>
                      <p>Số lượng: {item.quantity} (Kg)</p>
                      <p>Giá: {price}</p>
                    </div>
                    {(data?.data?.status == DONE_ORDER && !item?.isRate) && <button className="btn-rating" onClick={() => {
                      showModal()
                      setIdProduct(item._id)
                    }}>Đánh giá</button>}
                    <Modal footer="" title="Đánh giá sản phẩm" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                      <Rate defaultValue={1} onChange={(value) => { setRate(value) }
                      } />
                      <Input.TextArea style={{ margin: "20px 0" }} allowClear onChange={(e) => setContent(e.target.value)} />
                      <Button type="primary" onClick={() => onHandleRating()}>Submit</Button>
                    </Modal>

                  </div>
                </li>
              )
            })}

          </ul>
        </div>
        <div id="cancelled">
          {data?.data?.status == PENDING_ORDER && <Button type="primary" danger style={{ marginTop: "15px" }} onClick={() => handleCancelledOrder()}>Hủy đơn hàng</Button>}
        </div>

        {data?.data?.status == SUCCESS_ORDER && <Button type="primary" danger style={{ marginTop: "15px",backgroundColor:"#4b9f27" }} onClick={() => confirm(id)}>Đã nhận được hàng</Button>}
      </div>

    </div>
  )
}

export default DetailOrder