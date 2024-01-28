import DetailProduct from '../pages/client/detailProductPage/DetailProduct';
import HomePage from '../pages/client/homePage/HomePage';
import LayOutClient from '../layout/layout';
import ShowCart from '../pages/client/cartPage/ShowCart';
import { createBrowserRouter } from 'react-router-dom';
import Login from "../pages/auth/login/Login"
import Checkout from '../pages/client/checkoutPage/Checkout';
import ResultOrder from '../pages/client/resultPage/Result';
import Register from '../pages/auth/register/Register';
import ProductPage from '../pages/client/productsPage/ProductPage';
import NotFoundPage from '../pages/404-not-found-page/NotFoundPage';
import OrdersMemberPage from '../pages/client/ordersPage/OrdersMemberPage';
import DetailOrder from '../pages/client/ordersPage/DetailOrder';
import LayOutAD from '../layout/layoutAD';
import Dashboard from '../pages/admin/Dashboard';
import ListProducts from '../pages/admin/productPage/ListProducts';
import ListCategories from '../pages/admin/categoryPage/ListCategories';
import ListOrders from '../pages/admin/orderPage/ListOrders';
import ListEvaluation from '../pages/admin/evaluation/ListEvaluation';
import Authorization from '../middlewares/Authorization';
import CategoryPage from '../pages/client/categoyPage/CategoryPage';
export const router = createBrowserRouter([
  {
    path: "/",
    element: <LayOutClient />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: '/products', element: <ProductPage /> },
      { path: '/products/:id', element: <DetailProduct /> },
      { path: '/categories/:id', element: <CategoryPage /> },
      { path: '/cart', element: <ShowCart /> },
      { path: '/checkout', element: <Checkout /> },
      { path: '/result', element: <ResultOrder /> },
      { path: '/orders', element: <OrdersMemberPage /> },
      { path: '/orders/:id', element: <DetailOrder /> },
      { path: '/auth/login', element: <Login /> },
      { path: '/auth/register', element: <Register /> },
      { path: '/**', element: <NotFoundPage /> },

    ],
  }, {
    path: "*",
    element: <NotFoundPage />,
  },
  {
    path: "/admin",
    element: (<Authorization > <LayOutAD /></Authorization >),
    children: [
      { path: "/admin", element: <Dashboard /> },
      { path: '/admin/products', element: <ListProducts /> },
      { path: '/admin/categories', element: <ListCategories /> },
      { path: '/admin/orders', element: <ListOrders /> },
      { path: '/admin/evaluation', element: <ListEvaluation /> },
    ],
  }
]);