import React, { useEffect, useState } from 'react'
import "./checkout.css"
import { Button, Form, Input, message, Radio, Space, Steps } from 'antd';
import { useCreateOrderMutation } from '../../../service/order.service';
import { NavLink, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ArrowRightOutlined } from "@ant-design/icons"
import { useGetCartQuery } from '../../../service/cart.service';
import { useGetTokenQuery } from '../../../service/auth.service';
import { IUser } from '../../../common/user';
import { IProduct } from '../../../common/products';
import { formatPrice } from '../../../config/formatPrice';
import Step from '../../../components/Steps';
const Checkout = () => {
    const [data, setData] = useState([]);
    const { data: cartDb, } = useGetCartQuery();
    const { data: dataUser, error: errorToken } = useGetTokenQuery<IUser>()
    const [createOrder, { error, isSuccess }] = useCreateOrderMutation()
    const [user, setUser] = useState<IUser | null>(null)
    let cart = JSON.parse(localStorage.getItem("cart")!);
    const accessToken = document.cookie.split('=')[1]
    const navigate = useNavigate()

    const [form] = Form.useForm<IUser>();

    useEffect(() => {
        if (accessToken) {
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
    }, [cartDb]);

    useEffect(() => {
        if (error) {
            alert(error);
        }
        if (isSuccess) {
            if (!accessToken) {
                localStorage.removeItem("cart")
            }

            navigate("/result");
            location.reload()
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

    console.log(user);

    let totalPayment = 0
    totalPayment = data?.reduce((a: number, c: any) => a + c.price * c.quantity, 0)

    const onFinish = (values: any) => {
        values.products = data
        values.totalPayment = totalPayment
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

    return (
        <div>
            <div className="menu-detail">
                <NavLink to="/">HOME </NavLink>
                <ArrowRightOutlined rev={undefined} />
                CHECKOUT
            </div>
            {data && data.length > 0 ?
                <div>
                    <div className="shopping-cart">
                        <Step number={1} />
                        <table>
                            <thead>
                                <tr>
                                    <th>No.</th>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Subtotal</th>

                                </tr>
                            </thead>
                            <tbody>
                                {data?.map((item: IProduct, index: number) => {
                                    const price = formatPrice(item.price)
                                    const subTotalPrice = formatPrice(item.price * item.quantity)
                                    return (
                                        <tr key={item._id}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <div className='img-in-cart'>
                                                    <img src={item.image} alt="" />
                                                    {item.name}
                                                </div>

                                            </td>
                                            <td>{price}</td>
                                            <td>{item.quantity}</td>
                                            <td>
                                                {subTotalPrice}
                                            </td>

                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                        <h3 id='totalPayment'>TotalPayment :<p style={{ color: '#ed1b36' }}>{totalPayment?.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</p> </h3>
                    </div>
                    <div className="form-checkout" >
                        {/* {user && */}
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
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
                            <Form.Item label="Phương thức nhận hàng">
                                <Radio checked>Thanh toán khi nhận hàng</Radio>
                            </Form.Item>
                            <Form.Item>
                                <Button type='primary' htmlType="submit">SUBMIT</Button>
                            </Form.Item>
                        </Form>
                        {/* } */}
                    </div>
                </div> : ""}
        </div>
    )
}

export default Checkout