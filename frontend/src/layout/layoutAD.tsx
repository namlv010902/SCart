import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { AiFillDashboard } from "react-icons/ai";
import 'react-toastify/dist/ReactToastify.css';
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme, Button } from 'antd';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { IUser } from '../common/user';
import { useGetTokenQuery } from '../service/auth.service';
import { FaMoneyBill1Wave, FaProductHunt } from 'react-icons/fa6';
import { MdOutlineCategory, MdOutlineStarRate } from 'react-icons/md';
import { logoUrl } from '../components/logo/imgUrl';
import { MdAdminPanelSettings } from "react-icons/md";
interface IProps {
  info: IUser
}
const LayOutAD = () => {
  const { data, isSuccess } = useGetTokenQuery()
  console.log(data?.data?.role);
  const navigate = useNavigate()
  const logOut = () => {

  }
  useEffect(() => {
    if (data && data?.data?.role != "admin") {
      navigate("/")
    }
  }, [data, isSuccess])
  const { Header, Content, Footer, Sider } = Layout;
  type MenuItem = Required<MenuProps>['items'][number];
  function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label,
    } as MenuItem;
  }

  const items: MenuItem[] = [
    getItem('Dashboard', '1', <Link to="/admin" />),
    getItem('Products', 'sub1', <FaProductHunt />, [
      getItem('List products', '2', <Link to="/admin/products" />),
    ]),
    getItem('Category', 'sub2', <MdOutlineCategory />,
      [getItem('List categories', '4', <Link to="/admin/categories" />),
      ]),
    getItem('Order', '9', <FaMoneyBill1Wave />,
      [getItem('List orders', '5', <Link to="/admin/orders" />)]),
    getItem('Evaluation', '10', <MdOutlineStarRate />,
      [getItem('List comment', '6', <Link to="/admin/evaluation" />)])
  ];



  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <div>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
          <div style={{ textAlign: "center", padding: "10px 0" }} >
            <Link to="/">
              <img height={80} src={logoUrl} alt="" />
            </Link>
            {/* <Button onClick={() => logOut()} style={{ textAlign: "right" }} type="primary" danger >
              LogOut
            </Button> */}
          </div>
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
        </Sider>
        <Layout className="site-layout">
          <Header style={{ padding: "0 20px", background: colorBgContainer,boxShadow:"0 0 5px 5px #ccc" }} >
           <p>Hi,  <MdAdminPanelSettings></MdAdminPanelSettings>{data?.data?.userName}</p>
          </Header>


          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>

              </Breadcrumb.Item>

            </Breadcrumb>

            <Outlet>

            </Outlet>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer>
        </Layout>
      </Layout>

    </div>

  )
}

export default LayOutAD