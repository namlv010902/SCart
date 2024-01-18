import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
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
    getItem('Products', 'sub1', <UserOutlined />, [
      getItem('List products', '2', <Link to="/admin/products" />),
      getItem('Create products', '3', <Link to="/admin/products/add" />),
    ]),
    getItem('Category', 'sub2', <TeamOutlined />,
      [getItem('List categories', '4', <Link to="/admin/categories" />),
      getItem('Create category', '5', <Link to="/admin/categories/add" />)]),
    getItem('Order', '9', <FileOutlined />,
      [getItem('List orders', '4', <Link to="/admin/orders" />)]),
    getItem('Comment', '10', <FileOutlined />,
      [getItem('List comment', '4', <Link to="/admin/comment" />)])
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
            <Link to="/auth/login">
              <Button type="primary" >
                Login
              </Button></Link>
            <Button onClick={() => logOut()} style={{ textAlign: "right" }} type="primary" danger >
              LogOut
            </Button>
          </div>
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
        </Sider>
        <Layout className="site-layout">
          <Header style={{ padding: 0, background: colorBgContainer }} >

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