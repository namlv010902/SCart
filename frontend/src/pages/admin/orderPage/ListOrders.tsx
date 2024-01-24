import { Button, Space, Table, TableProps, Modal, Select, Form } from 'antd';
import { FaEye } from "react-icons/fa";
import { useCancelledOrderMutation, useDetailOrderQuery, useGetAllOrdersQuery, useUpdateOrderMutation } from '../../../services/order.service';
import { IOder } from '../../../common/order';
import { useEffect, useState } from 'react';
import { IProduct } from '../../../common/products';
import "./order.css"
import { toast } from 'react-toastify';
import { CANCELLED_ORDER, DONE_ORDER, PENDING_ORDER, PROCESS_ORDER, SUCCESS_ORDER } from '../../../constants/order';
import { formatTime } from '../../../config/formatTime';
import Loading from '../../../components/Loading';
import { formatPrice } from '../../../config/formatPrice';

const ListOrders = () => {
  const { data, isLoading } = useGetAllOrdersQuery()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [form] = Form.useForm()
  const [update, { isSuccess: successUpdate, error }] = useUpdateOrderMutation()
  const { data: dataOneOrder, isSuccess } = useDetailOrderQuery(orderId)
  const [cancelled, { isSuccess: successCancelled }] = useCancelledOrderMutation()

  const dataSource = data?.data?.docs
  const columns: TableProps<IOder>['columns'] = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      render: (_, record, index) => (
        <Space>
          {index + 1}
        </Space>
      )
    },
    {
      title: 'Mã đơn hàng',
      dataIndex: 'invoiceId',
      key: 'invoiceId',
    },
    {
      title: 'Ngày',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (_, record) => {
        const time = formatTime(record)
        return (
          <Space>{time}</Space>
        )
      }
    },
    {
      title: 'Tổng thanh toán',
      dataIndex: 'totalPayment',
      key: 'totalPayment',
      sorter: {
        compare: (a, b) => a.totalPayment - b.totalPayment,
        multiple: 2,
      },
      render: (_, record) => {
        const totalFormat = formatPrice(record.totalPayment)
        return (
          <Space>{totalFormat}</Space>
        )
      }
    },
    {
      title: 'Trạng thái đơn hàng',
      dataIndex: 'status',
      key: 'status',
      render: (_, record) => {
        return (
          <Space className={record.status == DONE_ORDER ? "done" : record.status == PROCESS_ORDER ? "processing" : record.status == CANCELLED_ORDER ? "cancelled" : record.status == PENDING_ORDER ? "pending" : record.status == SUCCESS_ORDER ? "success" : ""}>{record.status}</Space>
        )
      }
    },
    {
      title: 'Trạng thái thanh toán',
      dataIndex: 'pay',
      key: 'pay',
      render: (_, record) => (
        <Space>
          {record.pay ? "Đã thanh toán " : "Chưa thanh toán"}
        </Space>
      )
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button onClick={() => {
            showModal()
            setOrderId(record._id)
          }}><FaEye /></Button>
        </Space>
      )
    },

  ];

  useEffect(() => {
    if (isSuccess) {
      form.setFieldValue("status", dataOneOrder?.data?.status);
      console.log(dataOneOrder?.data?.status);

    }

  }, [isSuccess, dataOneOrder])
  useEffect(() => {
    if (successUpdate) {
      toast.success("Cập nhật trạng thái thành công")
      setIsModalOpen(false)
      return
    }
    if (error) {
      toast.error(error?.data?.message)
    }
  }, [successUpdate, error])

  useEffect(() => {
    if (successCancelled) {
      toast.success("Đã hủy đơn hàng")
      setIsModalOpen(false)
    }

  }, [successCancelled])
  const handleCancelOrder = () => {
    if (window.confirm("Hủy đơn hàng này")) {
      cancelled(orderId)
    }
  }
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  const onFinish = (values: any) => {
    console.log('Success:', values);
    const body = {
      _id: orderId,
      data: values
    }
    update(body)
  };

  const options = [
    { value: "Chờ xác nhận", label: "Chờ xác nhận" },
    { value: "Đang giao hàng", label: "Đang giao hàng" },
    { value: "Giao hàng thành công", label: "Giao hàng thành công" },
    { value: "Hoàn thành", label: "Hoàn thành" },
  ]
  const TIME = formatTime(dataOneOrder?.data)
  const total = formatPrice(dataOneOrder?.data?.totalPayment)
  return (
    <div>
      <h3>ListOrders</h3>
      {isLoading ? <Loading /> : <Table dataSource={dataSource} columns={columns} />}

      <Modal footer="" title="Thông tin đơn hàng" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p>Mã đơn hàng: {dataOneOrder?.data?.invoiceId}</p>
        <p>Đơn hàng ngày: {TIME}</p>
        <p>Tổng thanh toán: {total}</p>
        <p>Trạng thái đơn hàng: {dataOneOrder?.data?.status}</p>
        <strong style={{ color: "#3b9048", borderBottom: "1px solid #3b9048" }}>Thông tin nhận hàng</strong>
        <p>Khách hàng: {dataOneOrder?.data?.customerName}</p>
        <p>Số điện thoại: {dataOneOrder?.data?.phoneNumber}</p>
        <p>Email: {dataOneOrder?.data?.email}</p>
        <p>Địa chỉ nhận hàng: {dataOneOrder?.data?.address}</p>
        <strong style={{ color: "#3b9048", borderBottom: "1px solid #3b9048" }}>Sản phẩm</strong>
        <div className="productInOrder">
          {dataOneOrder?.data?.products?.map((item: IProduct) => {
            const price = formatPrice(item.price)
            return (
              <div className="itemProduct">
                <img src={item.image} alt="" />
                <div className="infoItem">
                  <p>{item.name} ({item.quantity}kg)</p>
                  <p>{price}</p>
                </div>
              </div>
            )
          })}
        </div>
        <Form
          layout='vertical'
          name="basic"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          form={form}
        >
          <Form.Item<IOder>
            label="Trạng thái đơn hàng"
            name="status"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Select
              options={options}
            />
          </Form.Item>
          <Form.Item >
            <Button type="primary" htmlType="submit">
              Cập nhật trạng thái đơn hàng
            </Button>
            {dataOneOrder?.data?.status == PENDING_ORDER ?
              <Button type="primary" onClick={() => handleCancelOrder()} danger style={{ marginLeft: "20px" }} >
                Hủy đơn
              </Button> : ""}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ListOrders