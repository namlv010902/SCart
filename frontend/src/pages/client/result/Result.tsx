import React from 'react'
import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';
import { scrollToTop } from '../../../config/scrollToTop';

const ResultOrder = () => {
  return (
    <div style={{padding:"90px 0"}}>
         <Result
    status="success"
    title="Đặt hàng thành công"
    subTitle="Vui lòng check lại mail để kiểm tra đơn hàng của bạn!"
    extra={[
      <Link to="/orders" onClick={()=>scrollToTop()} >
      <Button  type="primary" style={{backgroundColor:"#3b9048"}}> Đơn hàng của tôi</Button>
       
      </Link>,
     <Link to="/products" > <Button key="buy">Mua tiếp</Button></Link>
    ]}
  />
    </div>
  )
}

export default ResultOrder