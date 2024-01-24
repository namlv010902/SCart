import { NavLink, useNavigate } from "react-router-dom";
import "./login.css"
import { useEffect } from "react"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Checkbox, Form, Input } from 'antd';
import { useLoginMutation } from "../../../services/auth.service";
import { scrollToTop } from "../../../config/scrollToTop";
import { IUser } from "../../../common/user";
import { FcGoogle } from "react-icons/fc";
import { baseURL } from "../../../config/baseURL";
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
      if (data?.data?.role == "admin") {
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
      <div className="formLogin">
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
          style={{ width: "500px", margin: "0 auto" }}
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
            <Input style={{ height: "40px", fontSize: "18px" }} />
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
            <Input.Password style={{ height: "40px", fontSize: "18px" }} />
          </Form.Item>

          <Form.Item
            style={{ display: "flex", justifyContent: "center", }}
          >
            <NavLink className="google" to={baseURL}><FcGoogle />Login with Google</NavLink>
          </Form.Item>

          <Form.Item style={{ display: "flex", justifyContent: "center", }} >
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            <NavLink to="/auth/register"> Register</NavLink>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default Login;