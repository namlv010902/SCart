import DetailProduct from '../pages/client/detail-product/DetailProduct';
import HomePage from '../pages/client/home/HomePage';
import LayOutClient from '../layout/layout';
import ShowCart from '../pages/client/cart/ShowCart';
import { createBrowserRouter } from 'react-router-dom';
import Login from "../pages/auth/login/Login"
import Checkout from '../pages/client/checkout/Checkout';
import ResultOrder from '../pages/client/result/Result';
import Register from '../pages/auth/register/Register';
import ProductPage from '../pages/client/product-page/ProductPage';
import NotFoundPage from '../pages/404-not-found-page/NotFoundPage';
import OrdersMemberPage from '../pages/client/order/OrdersMemberPage';
import DetailOrder from '../pages/client/order/DetailOrder';
import LayOutAD from '../layout/layoutAD';
import Dashboard from '../pages/admin/Dashboard';
import ListProducts from '../pages/admin/productPage/ListProducts';
import ListCategories from '../pages/admin/categoryPage/ListCategories';
import ListOrders from '../pages/admin/orderPage/ListOrders';
export const router = createBrowserRouter([
    {
      path: "/",
      element: <LayOutClient />,
      children: [
        { path: "/", element: <HomePage /> },
        { path: '/products', element: <ProductPage /> },
        { path: '/products/:id', element: <DetailProduct /> },
        { path: '/cart', element: <ShowCart /> },
        { path: '/checkout', element: <Checkout /> },
        { path: '/result', element: <ResultOrder /> },
        { path: '/orders', element: <OrdersMemberPage /> },
        { path: '/orders/:id', element: <DetailOrder /> },
        { path: '/auth/login', element: <Login /> },
        { path: '/auth/register', element: <Register /> },
        { path: '/**', element: <NotFoundPage /> },
        // { path: '*', element: <NotFoundPage /> },
      ],
    },
    {
      path: "/admin",
      element: <LayOutAD />,
      children: [
        { path: "/admin", element: <Dashboard /> },
        { path: '/admin/products', element: <ListProducts /> },
        { path: '/admin/categories', element: <ListCategories /> },
        { path: '/admin/orders', element: <ListOrders /> },
      ],
    }
  ]);