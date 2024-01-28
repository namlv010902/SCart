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
import Loading from "../../../components/Loading";
import { useDispatch } from "react-redux";
import { saveTokenAndUser } from "../../../slices/auth";
interface FieldType {
  email?: string;
  password?: string;
  remember?: boolean;
};

const Login = () => {
  const [login, { error, isSuccess, data, isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message, { autoClose: 2000 });
    }
    if (isSuccess) {
      if (data && data?.data?.role == "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
      dispatch(saveTokenAndUser(data))
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
    <div style={{ padding: "50px 180px" }}>
      <div id="formLogin" >
        <div className="loading" >  {isLoading && <Loading />}</div>
        <div className="login"> <h1 >Log in</h1>
        </div>
        <div className="formLogin">
          <Form
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            layout="vertical"
            style={{ width: "400px", margin: "0 auto" }}
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
            <Form.Item style={{ display: "flex", justifyContent: "center" }} >
              <Button type="primary" htmlType="submit" className="btn_login">
                Log in
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
                <div> Need an account? <NavLink onClick={() => scrollToTop()} to="/auth/register"> Register</NavLink></div>
                <div> <NavLink to="/forgot-password"> Forgot password?</NavLink></div>
              </div>

            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default Login;