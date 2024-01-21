import { NavLink, useNavigate } from "react-router-dom";
import "./login.css"
import { useEffect } from "react"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Checkbox, Form, Input } from 'antd';
import { useLoginMutation } from "../../../service/auth.service";
import { scrollToTop } from "../../../config/scrollToTop";
import { IUser } from "../../../common/user";
import { FcGoogle } from "react-icons/fc";
interface FieldType {
  email?: string;
  password?: string;
  remember?: boolean;
};

const Login = () => {
  const [login, { error, isSuccess, data }] = useLoginMutation();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message, { autoClose: 2000 });
    }
    if (isSuccess) {
      if ( data?.data?.role == "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
      scrollToTop();
    }
  }, [error, isSuccess]);

  const onFinish = (values: FieldType) => {
    console.log('Success:', values);
    login(values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div style={{ padding: "30px 180px" }}>
      <div className="login"> <h1 >Login</h1></div>
      <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout="vertical"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please input your email!' },
            {
              type: "email",
              message: "Email invalid!"
            }
          ]}
          hasFeedback
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: 'Please input your password!' },
            {
              min: 6,
              message: "Min length must be at least 6 characters"
            }
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="remember"
          valuePropName="checked"
          wrapperCol={{ offset: 8, span: 16 }}
        >
          <Checkbox>Remember me</Checkbox>
        </Form.Item>
        <Form.Item>
          <NavLink to="http://localhost:8080/api/auth/google/login"><FcGoogle/> Google</NavLink>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <NavLink to="/auth/register">Register</NavLink>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Login;