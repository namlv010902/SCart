import { useRegisterMutation } from "../../../services/auth.service";
import "../login/login.css"
import { useEffect, useState } from "react"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Spin, Form, Input } from 'antd';
import { NavLink, useNavigate } from "react-router-dom";
import { scrollToTop } from "../../../config/scrollToTop";
import { IUser } from "../../../common/user";
import { baseURL } from "../../../config/baseURL";
import { FcGoogle } from "react-icons/fc";
import Loading from "../../../components/Loading";
type FieldType = {
    userName?: string;
    password?: string;
    email?: string;
    phoneNumber?: string;
    confirmPassword?: string;
};
const Register = () => {
    const [register, { error, isLoading, isSuccess }] = useRegisterMutation()
    const navigate = useNavigate()
    useEffect(() => {
        if (error) {
            toast.error(error?.data.message, { autoClose: 2000, });
        }
        if (isSuccess) {
            navigate("/auth/login")
            toast.success("Register successfully")
            scrollToTop()
        }


    }, [error, isSuccess])
    const onFinish = async (values: any) => {
        console.log('Success:', values);
        const response = await register(values);
        const { error }: any = response
        console.log('Mutation:', error.data.message);
    };
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            <div style={{ padding: "30px 180px" }}>
                <div id="formLogin">
                    <div className="loading" >  {isLoading && <Loading />}</div>

                    <div className="login"> <h1 >Register</h1>
                    </div>
                    <Form
                        name="basic"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        layout="vertical"
                        style={{ width: "400px", margin: "0 auto" }}
                    >
                        <Form.Item<FieldType>
                            label="Username"
                            name="userName"
                            hasFeedback
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                            <Input style={{ height: "40px", fontSize: "18px" }} />
                        </Form.Item>
                        <Form.Item<FieldType>
                            label="Email"
                            name="email"
                            hasFeedback
                            rules={[{ required: true, message: 'Please input your email!' }, {
                                type: "email",
                                message: "The email is not valid!"
                            }]}
                        >
                            <Input style={{ height: "40px", fontSize: "18px" }} />
                        </Form.Item>
                        <Form.Item<FieldType>
                            label="Phone Number"
                            name="phoneNumber"
                            hasFeedback

                            rules={[{ required: true, message: 'Please input your phone number!' }, {
                                message: "The phone number is not valid!",
                                pattern: new RegExp(/^0[0-9]{9}/)
                            }]}
                        >
                            <Input maxLength={10} style={{ height: "40px", fontSize: "18px" }} />
                        </Form.Item>
                        <Form.Item<FieldType>
                            label="Password"
                            name="password"
                            hasFeedback
                            rules={[{ required: true, message: 'Please input your password!' }, {
                                min: 6,
                                message: "Min length must be at least 6 characters"
                            }]}
                        >
                            <Input.Password style={{ height: "40px", fontSize: "18px" }} />
                        </Form.Item>
                        <Form.Item<FieldType>
                            label="Confirm Password"
                            name="confirmPassword"
                            hasFeedback
                            rules={[{ required: true, message: 'Please input confirmPassword!' }]}
                        >
                            <Input.Password style={{ height: "40px", fontSize: "18px" }} />
                        </Form.Item>

                        <Form.Item style={{ display: "flex", justifyContent: "center", }}>
                            <Button className="btn_login" type="primary" htmlType="submit">
                                Register
                            </Button>
                        </Form.Item>
                        <Form.Item
                            style={{ display: "flex", justifyContent: "center", }}
                        >
                            <div className="or">
                                <hr />
                                <p> Or </p>
                                <hr />
                            </div>
                            <NavLink className="google" to={baseURL}><FcGoogle /> Continue with Google</NavLink>
                        </Form.Item>
                        <Form.Item  >
                            <div className="item-login" >
                                <div> Already have an account?  <NavLink onClick={() => scrollToTop()} to="/auth/login"> Log in</NavLink></div>
                            </div>

                        </Form.Item>
                    </Form>
                </div>
            </div>
        </>
    )
}

export default Register