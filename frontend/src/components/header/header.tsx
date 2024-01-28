import { MdDashboard } from "react-icons/md";
import { NavLink, useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from 'react';
import { Badge } from 'antd';
import { IoIosLock } from "react-icons/io";
import { Popover } from 'antd';
import { IoMdArrowDropdown } from "react-icons/io";
import { PiHandbagSimpleLight } from "react-icons/pi";
import "./header.css"
import { scrollToTop } from "../../config/scrollToTop";
import { FaMoneyBill1Wave } from "react-icons/fa6";
import Search from "../search/Search";
import { FaUser, FaUserCheck } from "react-icons/fa";
import { BiLogOutCircle } from "react-icons/bi";
import { useGetTokenQuery, useLogOutMutation } from "../../services/auth.service";
import { useGetCartQuery } from "../../services/cart.service";
import { IUser } from "../../common/user";
import { logoUrl } from "../logo/imgUrl";
import { useSelector, useDispatch } from 'react-redux';
import { selectCart } from "../../slices/cartLocal";
import { clearTokenAndUser, saveTokenAndUser } from "../../slices/auth";
import useLogout from "../../hooks/useLogout";
interface IMenu {
    name: string,
    link: string
}
const Header = () => {
    const { data, error } = useGetTokenQuery()
    const [logOut, { isSuccess: logOutSuccess }] = useLogOutMutation()
    const { data: cartDB, isSuccess } = useGetCartQuery()
    const navigate = useNavigate()
    const [cartData, setCartData] = useState([])
    const [user, setUser] = useState<null | IUser>()
    const cart = useSelector(selectCart);
    // console.log(cart);
    const dispatch = useDispatch()

    useEffect(() => {
        if (data) {
            setCartData(cartDB?.body?.data?.products)
        } else {
            setCartData(cart)
        }

    }, [cartDB, isSuccess, cart]);
    useEffect(() => {
        if (error) {
            setUser(null)
        } else {
            setUser(data?.data)

            dispatch(saveTokenAndUser(data))
        }

    }, [error, data]);

    const menu = [
        { name: "HOME", link: "/" },
        { name: "CMS CONTENT", link: "/#" },
        { name: "SHOP", link: "/products" },
        { name: "BLOGS", link: "/#" },
        { name: "CONTACT US", link: "/#" },
        { name: "ABOUT US", link: "/#" },
    ]
    const url = useParams()
    console.log(url);
    const handleLogout = useLogout()
    const content = (
        <div className="drop-down">
            <div className="drop-down-item">
                {user != null ? <><NavLink to="#"><FaUserCheck /> {user?.userName}</NavLink> <br />
                    {user?.role == "admin" && <NavLink to="/admin"><MdDashboard /> Quản trị</NavLink>}
                    <br /> <NavLink onClick={() => handleLogout()} to="#"><BiLogOutCircle /> Logout</NavLink></>
                    : <NavLink onClick={() => scrollToTop()} to="/auth/login"><FaUser /> Login</NavLink>}
            </div>
            {/* <div className="drop-down-item">
                <Badge count={3}>  <NavLink to="/auth/login"><FaHeart /> WhistList</NavLink></Badge>
            </div> */}
            <div className="drop-down-item">
                <NavLink onClick={() => scrollToTop()} to="/orders"><FaMoneyBill1Wave /> Orders</NavLink>
            </div>
        </div>
    )
    const [itemMenu, setItemMenu] = useState("")
    console.log(itemMenu);

    return (
        <>
            <header className="header">
                <div className="logo">
                    <NavLink to="/" onClick={() => scrollToTop()}> <img src={logoUrl} alt="" /></NavLink>
                </div>
                <nav>
                    <ul>
                        <li>
                            {menu.map((item: IMenu) => {
                                return (
                                    <>
                                        <NavLink id={item.name == itemMenu ? "menuActive" : ""} onClick={() => {
                                            scrollToTop()
                                            setItemMenu(item.name)

                                        }} to={item.link}> {item.name}</NavLink>
                                    </>
                                )
                            })
                            }
                            <NavLink to="#"><IoIosLock></IoIosLock> S-CART</NavLink>
                            {user != null ? <Popover content={content} > <NavLink to="#" ><IoIosLock></IoIosLock> MY PROFILE </NavLink></Popover> : <Popover content={content} > <NavLink to="#" ><IoIosLock></IoIosLock> CUSTOMERS </NavLink></Popover>}
                        </li>
                    </ul>

                </nav>
                <div className="usd">
                    <div style={{ margin: "0 15px", display: "flex", alignItems: "center" }}>
                        <img height={25} width={25} src="https://demo.s-cart.org/data/language/flag_vn.png" alt="" /><IoMdArrowDropdown rev={undefined} />
                    </div>
                    <p>USD DOLA</p><IoMdArrowDropdown />
                </div>
                <div className="icon-header">
                    <Search></Search>
                    <Badge count={cartData?.length}> <NavLink onClick={() => scrollToTop()} to="/cart" style={{ color: "#151515" }}><PiHandbagSimpleLight style={{ fontSize: "30px" }} /></NavLink></Badge>
                </div>
            </header>
        </>
    )
}

export default Header