import React, { useEffect, useState } from 'react'
import "./checkout.css"
import { IoBagCheckOutline } from "react-icons/io5";
import { FcShipped } from "react-icons/fc";
import { Button, Form, Input, message, Modal, Radio, Space, Steps } from 'antd';
import { useCreateOrderMutation } from '../../../services/order.service';
import { NavLink, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ArrowRightOutlined } from "@ant-design/icons"
import { useGetCartQuery } from '../../../services/cart.service';
import { useGetTokenQuery } from '../../../services/auth.service';
import { IUser } from '../../../common/user';
import { IProduct } from '../../../common/products';
import { formatPrice } from '../../../config/formatPrice';
import Step from '../../../components/Steps';
import Loading from '../../../components/Loading';
import { useSelector } from 'react-redux';
import { selectCart } from '../../../slices/cartLocal';
const Checkout = () => {
    const [data, setData] = useState([]);

    const { data: cartDb, isSuccess: getCartDb, isLoading,refetch} = useGetCartQuery();
    const { data: dataUser, error: errorToken } = useGetTokenQuery<IUser>()
    const [createOrder, { error, isSuccess }] = useCreateOrderMutation()
    const [user, setUser] = useState<IUser | null>(null)
    const cart = useSelector(selectCart);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [total_Payment, setTotal_Payment] = useState(0)
    const info = useSelector(state => state.authSlice)
    const auth = useSelector(state => state.authSlice)
    console.log("INFO: ", info);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const navigate = useNavigate()

    const [form] = Form.useForm<IUser>();

    useEffect(() => {

        if (auth?.user?._id) {
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
            console.log("cart-settings", cart);
            setData(cart);
        }
    }, [auth, cart, cartDb]);
    console.log("running cart...", data);
    useEffect(() => {
        if (error) {
            alert(error);
        }
        if (isSuccess) {
            refetch()
            if (!getCartDb) {
                localStorage.removeItem("cart")
            }
            navigate("/result");
            // location.reload()
        }
    }, [error, isSuccess])
    useEffect(() => {
        if (!errorToken) {
            setUser(dataUser?.data)
            form.setFieldValue("customerName", dataUser?.data.userName)
            form.setFieldValue("phoneNumber", dataUser?.data.phoneNumber)
            form.setFieldValue("address", dataUser?.data.address)
            form.setFieldValue("email", dataUser?.data.email)
            form.setFieldValue("note", dataUser?.data.note)
        } else {
            setUser(null)
        }
    }, [errorToken, dataUser])
    useEffect(() => {

        setTotal_Payment(data?.reduce((a: number, c: any) => a + c.price * c.quantity, 0))
    }, [data])
    // console.log(data);
    const onFinish = (values: any) => {
        values.products = data
        
        values.totalPayment = total_Payment
        console.log('Success:', values);
        Swal.fire({
            title: "Xác nhận đặt hàng?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "OKI"
        }).then((result: any) => {
            if (result.isConfirmed) {
                createOrder(values)
            }
        });

    };
    const onFinishFailed = (error: any) => {
        message.error('Submit failed!');
        console.log('Failed:', error);
    };
    const dataVoucherFake = [
        { code: "voucher123", title: "Tết 2024", quantity: 3, dateStart: "1/1/2024", dateEnd: "1/3/2024", percent: 30, miniMumOrder: 30000, maxReduce: 25000 },
        { code: "voucherabc", title: "Tết 2025", quantity: 3, dateStart: "1/1/2024", dateEnd: "1/3/2024", percent: 10, miniMumOrder: 130000, maxReduce: 20000 },
        { code: "voucher111", title: "Tết 2026", quantity: 3, dateStart: "1/1/2024", dateEnd: "1/3/2024", percent: 10, miniMumOrder: 30000, maxReduce: 20000 },
        { code: "voucher222", title: "Tết 2027", quantity: 3, dateStart: "1/1/2024", dateEnd: "1/3/2024", percent: 50, miniMumOrder: 30000, maxReduce: 40000 },
    ]
    const totalPayment = data?.reduce((a: number, c: any) => a + c.price * c.quantity, 0)
    const formatTOTAL = formatPrice(totalPayment)
    const handleAddVoucher = (voucher: any) => {
        if (!info.accessToken) {

            message.error("Bạn cần đăng nhập để sử dụng mã!")
            return
        }

        if (total_Payment >= voucher.miniMumOrder) {
            const percent = voucher.percent
            if (totalPayment * (percent / 100) >= voucher.maxReduce) {
                setTotal_Payment(totalPayment - voucher.maxReduce)
            } else {
                setTotal_Payment(totalPayment - (totalPayment * (percent / 100)))
            }
            setIsModalOpen(false)
            message.success("Áp dụng mã thành công")
            return
        }
        message.error("Bạn cần đăng nhập để áp dụng mã!")

    }
    return (
        <div style={{ minHeight: "80vh" }}>
            <div className="menu-detail">
                <NavLink to="/">HOME </NavLink>
                <ArrowRightOutlined rev={undefined} />
                CHECKOUT
            </div>
            <div className="checkout-main">  <Step number={1} />
                {isLoading ? <Loading /> : <>
                    {data && data?.length > 0 ?
                        <div className='checkout-info'>
                            <div className="form-checkout" >
                                <p style={{ textAlign: "center" }}>Thông tin nhận hàng</p>
                                <Form
                                    form={form}
                                    layout="vertical"
                                    onFinish={onFinish}
                                    onFinishFailed={onFinishFailed}
                                    style={{ width: "400px" }}
                                    autoComplete="off" >
                                    <Form.Item
                                        name="customerName"
                                        label="Customer Name"
                                        rules={[{ required: true, message: "Please input your name!" }, { type: 'string' }]}
                                        hasFeedback

                                    >
                                        <Input placeholder="Your Name" />
                                    </Form.Item>
                                    <Form.Item
                                        name="phoneNumber"
                                        label="Phone Number"
                                        rules={[{
                                            required: true,
                                            message: "Please input your phone number!"
                                        }, {
                                            pattern: new RegExp(/^0[0-9]{9}/),
                                            message: "A value must be entered",
                                        }]}
                                        hasFeedback
                                        initialValue={user?.phoneNumber} >
                                        <Input placeholder="Your phone number" maxLength={10} />
                                    </Form.Item>
                                    <Form.Item
                                        name="email"
                                        label="Email"
                                        rules={[{ required: true, message: "Please input your email!" }, { type: 'email', message: "Email invalid!" }]}
                                        hasFeedback
                                        initialValue={user?.email}>
                                        <Input placeholder="Your email" />
                                    </Form.Item>
                                    <Form.Item
                                        name="address"
                                        label="Address shipping"
                                        rules={[{ required: true, message: "Please input your address shipping!" }]}
                                        hasFeedback
                                        initialValue={user?.address}>
                                        <Input placeholder="EX: so 10, Ngo 86, Pho Kieu Mai" />
                                    </Form.Item>
                                    <Form.Item label="Note" name="note" >
                                        <Input.TextArea allowClear />
                                    </Form.Item>
                                    <Form.Item label="Phương thức thanh toán:">
                                        <Radio checked>Thanh toán khi nhận hàng</Radio>
                                    </Form.Item>
                                    <Form.Item>
                                        <Button className='btn_place' type='primary' htmlType="submit">Đặt hàng</Button>
                                    </Form.Item>
                                </Form>

                            </div>
                            <div className="cart-checkout" style={{ padding: "0px" }}>
                                <h5><IoBagCheckOutline /> Đơn hàng</h5>
                                {data?.map((item: IProduct, index: number) => {
                                    const subTotalPrice = formatPrice(item.price * item.quantity)
                                    return (
                                        <div key={item._id} className='item-cart-checkout' >
                                            <div>
                                                <div className='img-in-cart'>
                                                    <img src={item.image} alt="" style={{ height: "70px", width: "auto" }} />
                                                    {item.name}( {item.quantity}/kg )
                                                </div>

                                            </div>
                                            <div>
                                                {subTotalPrice}
                                            </div>

                                        </div>
                                    )
                                })}
                                <h4>Tổng tiền hàng: {formatTOTAL}</h4>
                                <h2 className='free-ship'>Đơn vị vận chuyển: <strong><p><FcShipped /></p>  Free ship</strong></h2>
                                <h3 id='totalPayment'>Tổng thanh toán :<p style={{ color: '#ed1b36' }}>{total_Payment?.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</p> </h3>
                                <form action="" className='form-voucher'>
                                    <input type="text" name="" id="" />
                                    <button >Áp dụng</button>
                                </form>
                                <p className='view-all-voucher' onClick={() => showModal()}>Xem tất cả mã voucher</p>
                                <Modal footer="" title="Mã khuyến mãi" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                                    {dataVoucherFake.map((voucher: any) => {

                                        return (
                                            <div className='voucher-item'>
                                                <div>
                                                    <strong>{voucher.title}</strong>
                                                    <p>Giảm {voucher.percent}% Đơn hàng {voucher.miniMumOrder} Tối đa {voucher.maxReduce}</p>
                                                    <p>Voucher bắt đầu từ{voucher.dateStart} ... {voucher.dateEnd}</p>
                                                </div>
                                                <Button onClick={() => handleAddVoucher(voucher)} type='primary' style={{ backgroundColor: "#04aa6d" }}>Áp dụng</Button>
                                            </div>
                                        )
                                    })}
                                </Modal>
                            </div>

                        </div> : <h3 style={{ margin: "100px 180px" }}>The shopping cart empty</h3>}
                </>}</div>



        </div>
    )
}

export default Checkout