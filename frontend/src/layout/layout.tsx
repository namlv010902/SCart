import React from 'react'
import Header from '../components/header/header'
import { Outlet } from 'react-router-dom'
import Footer from '../components/footer/footer'
import {ArrowUpOutlined} from "@ant-design/icons"
import { scrollToTop } from '../config/scrollToTop'
const LayOutClient = () => {
  return (
    <>
    <Header></Header>
     <main style={{marginTop:"100px"}}>
     <Outlet></Outlet>
     </main>
      <ArrowUpOutlined id='scroll' onClick={()=>scrollToTop()} rev={undefined}/>
    <Footer></Footer>
    </>
  )
}

export default LayOutClient