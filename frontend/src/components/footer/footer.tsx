import React from 'react'
import { FacebookOutlined,SendOutlined, TwitterOutlined, PlaySquareOutlined, YoutubeOutlined, InstagramOutlined, PhoneOutlined, MailOutlined } from "@ant-design/icons"
import "./footer.css"
import { logoUrl } from '../logo/imgUrl'
const Footer = () => {
  return (
    <>
      <footer>
        <div className="ft_col">
          <div className="ft_logo">
            <img height={130} src={logoUrl} alt="" />
          </div>
          <p>Demo S-Cart : Free Laravel <br /> eCommerce</p>
          <hr />
          <div className="mxh" >
            <FacebookOutlined style={{ color: "#fff", fontSize: "20px" }} rev={undefined} />
            <TwitterOutlined style={{ color: "#fff", fontSize: "20px" }} rev={undefined} />
            <YoutubeOutlined style={{ color: "#fff", fontSize: "20px" }} rev={undefined} />
            <InstagramOutlined style={{ color: "#fff", fontSize: "20px" }} rev={undefined} />
          </div>
        </div>
        <div className="ft_col">
          <h2>ABOUT US</h2>
          <div style={{ display: "flex", alignItems: "center" }}><PlaySquareOutlined rev={undefined} style={{ fontSize: "20px", color: "#d9a1a3", marginRight: "10px" }} /> <p>Address: 123st - abc - xyz</p></div>
          <div style={{ display: "flex", alignItems: "center",marginTop:"20px" }}><PhoneOutlined rev={undefined} style={{ fontSize: "20px", color: "#d9a1a3", marginRight: "10px" }} /> <p>Hotline: Support: 0987654321</p></div>
          <div style={{ display: "flex", alignItems: "center",marginTop:"20px" }}><MailOutlined rev={undefined} style={{ fontSize: "20px", color: "#d9a1a3", marginRight: "10px" }} /> <p>Email: demo@s-cart.org</p></div>
          <form action="">
            <input type="text" placeholder='Email' />
            <button disabled><SendOutlined rev={undefined} /></button>
          </form>
        </div>
        <div className="ft_col">
          <h2>MY PROFILE</h2>
          <p>My profile</p>
          <p> Product compare</p>
          <p> Product Wishlist</p>


        </div>
      </footer>
    </>
  )
}

export default Footer