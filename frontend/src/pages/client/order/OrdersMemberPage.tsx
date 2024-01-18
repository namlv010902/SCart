import { ArrowRightOutlined } from '@ant-design/icons'
import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useGetOrderForMemberQuery } from '../../../service/order.service'
import { IOder } from '../../../common/order'
import { GrView } from "react-icons/gr";
import { formatPrice } from '../../../config/formatPrice'
const OrdersMemberPage = () => {
  const { data } = useGetOrderForMemberQuery()
  console.log(data?.data);
  const DATA = data?.data?.slice().reverse()
  console.log(DATA);
  return (
    <div>

      <div className="menu-detail">
        <NavLink to="/">HOME </NavLink>
        <ArrowRightOutlined rev={undefined} />
        <Link to="#"> ORDER</Link>
      </div>
      <div className="shopping-cart">
        {data && data?.data?.length > 0 ?
          <>
            <table>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Date</th>
                  <th>TotalPayMent</th>
                  <th>StatusOrder</th>
                  <th>StatusPayment</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {DATA?.map((item: IOder, index: number) => {
                  const formatTime = new Date(item.createdAt).toDateString()
                  const total = formatPrice(item.totalPayment)
                  return (
                    <tr key={item._id}>
                      <td>{index + 1}</td>
                      <td>
                        {formatTime}
                      </td>
                      <td>{total}</td>
                      <td>{item.status}</td>
                      <td>{item.pay ? "Đã Thanh Toán" : "Chưa Thanh Toán"}</td>
                      <td id='remove-product-in-cart'>
                        <Link to={"/orders/" + item._id}><GrView /></Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

          </>
          : <h3>The orders empty!</h3>
        }

      </div>

    </div>
  )
}

export default OrdersMemberPage