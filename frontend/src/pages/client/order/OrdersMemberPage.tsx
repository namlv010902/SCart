import { ArrowRightOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useFilterOrderForMemberMutation, useFindOneOrderMutation, useGetOrderForMemberQuery, useSearchInvoiceIdMutation } from '../../../service/order.service'
import { IOder } from '../../../common/order'
import { GrView } from "react-icons/gr";
import { formatPrice } from '../../../config/formatPrice'
import { STATUS_ORDER } from '../../../constants/order'
import { Button, Input } from 'antd'
import Loading from '../../../components/Loading'
const OrdersMemberPage = () => {
  const { data, isLoading } = useGetOrderForMemberQuery()
  const [filter, { data: dataFilter, isSuccess, isLoading: loadingFilter }] = useFilterOrderForMemberMutation()
  const [orders, setOrders] = useState<IOder[]>([])
  const [searchInvoiceId, { data: dataSearch }] = useSearchInvoiceIdMutation()
  const [searchValue, setSearchValue] = useState("")
  const [findOrder, { data: dataFindOneOrder, isLoading: loadingFindOne }] = useFindOneOrderMutation()
  const handleFilter = (status: string) => {
    console.log(status);

    filter(status);
  }
  useEffect(() => {
    console.log("running");
    if (isSuccess) {
      setOrders(dataFilter?.data)
    } else {
      setOrders(data?.data?.docs)
    }

  }, [isSuccess, data])
  useEffect(() => {
    if (dataSearch) {
      setOrders(dataSearch?.data.docs)
    }
  }, [dataSearch])
  // const DATA = orders.slice().reverse()
  const handleFindOneOrder = () => {
    findOrder(searchValue)
  }
  console.log(dataFindOneOrder);

  const handleSearchI = () => {
    searchInvoiceId(searchValue);
  }
  return (
    <div>

      <div className="menu-detail">
        <NavLink to="/">HOME </NavLink>
        <ArrowRightOutlined rev={undefined} />
        <Link to="#"> ORDER</Link>
      </div>
      {isLoading ? <Loading /> :
        <div className="shopping-cart">
          {data ? <>
            <div style={{ display: "flex", alignItems: "center" }}>
              {STATUS_ORDER.map((item: string) => (
                <Button onClick={() => handleFilter(item)} type='primary' style={{ marginRight: "15px", backgroundColor: "#3b9048" }}>{item}</Button>
              ))}
              <Input onChange={(e) => { setSearchValue(e.target.value) }} placeholder="Search..."></Input> <Button onClick={() => handleSearchI()} type='primary' danger>Search</Button>
            </div>

            {loadingFilter ? <Loading /> :
              <table>
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>InvoiceId</th>
                    <th>Date</th>
                    <th>TotalPayMent</th>
                    <th>StatusOrder</th>
                    <th>StatusPayment</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {orders?.map((item: IOder, index: number) => {
                    const formatTime = new Date(item.createdAt).toDateString()
                    const total = formatPrice(item.totalPayment)
                    return (
                      <tr key={item._id}>
                        <td>{index + 1}</td>
                        <td>{item.invoiceId}</td>
                        <td>
                          {formatTime}
                        </td>
                        <td>{total}</td>
                        <td>{item.status}</td>
                        <td>{item.pay ? "Đã Thanh Toán" : "Chưa Thanh Toán"}</td>
                        <td id='remove-product-in-cart'>
                          <Link to={"/orders/" + item._id} style={{ color: "#3b9048" }}><GrView /></Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>

              </table>}

          </> : <>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Input onChange={(e) => { setSearchValue(e.target.value) }} placeholder="Search..."></Input> <Button onClick={() => handleFindOneOrder()} type='primary' danger>Search</Button>
            </div>
            <table>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>InvoiceId</th>
                  <th>Date</th>
                  <th>TotalPayMent</th>
                  <th>StatusOrder</th>
                  <th>StatusPayment</th>
                  <th></th>
                </tr>
              </thead>
              {loadingFindOne ? <Loading /> : <tbody>
                {dataFindOneOrder?.data?.length > 0 && dataFindOneOrder?.data?.map((item: IOder, index: number) => {
                  const formatTime = new Date(item?.createdAt).toDateString()
                  const total = formatPrice(item?.totalPayment)
                  return (
                    <tr key={item?._id}>
                      <td>{index + 1}</td>
                      <td>{item?.invoiceId}</td>
                      <td>
                        {formatTime}
                      </td>
                      <td>{total}</td>
                      <td>{item?.status}</td>
                      <td>{item?.pay ? "Đã Thanh Toán" : "Chưa Thanh Toán"}</td>
                      <td id='remove-product-in-cart'>
                        <Link to={"/orders/" + item?._id} style={{ color: "#3b9048" }}><GrView /></Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>}


            </table>
          </>}



        </div>
      }

    </div>
  )
}

export default OrdersMemberPage