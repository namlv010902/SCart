
import { Button, Image, Space, Table, Tag, Spin, InputNumber, Select, Switch } from 'antd';
import type { TableProps } from 'antd';
import { useCreateProductMutation, useGetAllProductQuery, useGetOneProductMutation, useGetProductByIdQuery, useRemoveProductMutation, useUpdateProductMutation } from '../../../services/product.service';
import { formatPrice } from '../../../config/formatPrice';
import { RiDeleteBin5Fill } from "react-icons/ri";
import { MdEditSquare } from "react-icons/md";
import { IProduct } from '../../../common/products';
import { Modal, Checkbox, Form, Input } from 'antd';
import Loading from '../../../components/Loading';
import { useEffect, useState } from 'react';
import { useGetAllCategoryQuery } from '../../../services/category.service';
import { ICategory } from '../../../common/category';
import { useUploadMutation } from '../../../services/upload.service';
import { IoMdAdd } from 'react-icons/io';
import { toast } from 'react-toastify';


const ListProducts = () => {
  const { data: DataProducts, isLoading } = useGetAllProductQuery()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenUpdate, setIsModalOpenUpdate] = useState(false);
  const { data: DataCategories } = useGetAllCategoryQuery()
  const [form] = Form.useForm<IProduct>();
  const [upload, { isSuccess, data: dataUpload, isLoading: loadingUpload }] = useUploadMutation()
  const [imgUrl, setImgUrl] = useState([])
  const [createProduct, { isSuccess: created }] = useCreateProductMutation()
  const [remove] = useRemoveProductMutation()
  const [idPrd, setIdPrd] = useState("")
  const [getProduct, { data: DataOneProduct, isSuccess: success }] = useGetOneProductMutation()
  const [update, { isSuccess: successUpdate }] = useUpdateProductMutation()

  useEffect(() => {
    if (idPrd !== "") {
      getProduct(idPrd);
    }
  }, [idPrd]);
  useEffect(() => {
    if (successUpdate) {
      toast.success("Đã update thành công")
      setIsModalOpenUpdate(false)
      return
    }
    if (created) {
      toast.success("Đã thêm thành công")
      setIsModalOpen(false);
      return
    }


  }, [successUpdate, created]);
  useEffect(() => {
    if (success) {
      console.log(DataOneProduct);
      form.setFieldValue("name", DataOneProduct?.data?.name)
      form.setFieldValue("price", DataOneProduct?.data?.price)
      form.setFieldValue("quantity", DataOneProduct?.data?.quantity)
      form.setFieldValue("desc", DataOneProduct?.data?.desc)
      form.setFieldValue("categoryId", DataOneProduct?.data?.categoryId?._id)
      form.setFieldValue("discount", DataOneProduct?.data?.discount)
      form.setFieldValue("outStanding", DataOneProduct?.data?.outStanding)
      form.setFieldValue("image", DataOneProduct?.data?.image)
      setImgUrl(DataOneProduct?.data?.image)
    }
  }, [success]);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const showModalUpdate = () => {
    setIsModalOpenUpdate(true)

  };
  const handleOk = () => {
    setIsModalOpen(false);
    setIsModalOpenUpdate(false)
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsModalOpenUpdate(false)
  };

  const columns: TableProps<IProduct>['columns'] = [
    {
      title: 'STT',
      key: "index",
      render: (a, b, index) => <Tag color='green'>{index + 1}</Tag>,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (_, data) => <Image height={70} src={data?.image} />,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (_, record) => {
        const { price, discount } = record
        const priceSale = price - price * discount / 100
        const priceFormatted = formatPrice(price)
        const priceSaleFormatted = formatPrice(priceSale)
        return (
          <Space>
            {discount > 0 && <del>{priceFormatted}</del>}  {priceSaleFormatted}
          </Space>
        )
      }
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Discount',
      dataIndex: 'discount',
      key: 'discount',
      render: (_, record) => (<>
        {record.discount}%
      </>)
    },
    {
      title: 'Category',
      dataIndex: 'categoryId',
      key: 'categoryId',
      render: (_, data) => (
        <p>{data?.categoryId?.name}</p>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => handelRemoveProduct(record._id)}><RiDeleteBin5Fill /></Button>
          <Button onClick={() => {
            showModalUpdate()
            setIdPrd(record._id)
          }}><MdEditSquare /></Button>
        </Space>
      ),
    },
  ];

  const data = DataProducts?.data?.docs
  const onFinish = (values: any) => {
    console.log('Success:', values);
    createProduct(values)
  };


  const onFinishUpdate = (values: any) => {
    console.log('Success:', values);
    if (idPrd != "") {
      const dataForm = {
        _id: idPrd,
        data: values
      }
      update(dataForm)
    }

    setIsModalOpenUpdate(false)
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  const onChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  const onSearch = (value: string) => {
    console.log('search:', value);
  };
  const options = DataCategories?.data?.docs.map((option: ICategory) => ({
    label: option.name,
    value: option._id,
  }));


  // Filter `option.label` match the user type `input`
  const filterOption = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  useEffect(() => {
    if (isSuccess) {
      form.setFieldValue("image", dataUpload?.data[0]?.url)
      setImgUrl(dataUpload?.data)
    }
  }, [isSuccess])
  console.log("images uploaded successfully", imgUrl, dataUpload?.data);

  const handleUpload = (value: any) => {
    if (value.target.files) {
      const files = value.target.files;
      console.log(files, typeof (files));
      const formData = new FormData();

      for (let i = 0; i < files.length; i++) {
        formData.append('image', files[i]);
      }
      upload(formData);
 
    }
  }
  const handelRemoveProduct = (id: string) => {
    if (id && window.confirm("Xóa sản phẩm!")) {
      remove(id)
    }
  }
  return (
    <div>
      <h3>ListProducts</h3>
      {isLoading ? <Loading /> : <div>
        <Button type='primary' style={{ backgroundColor: "#3b9048", margin: "20px 0" }} onClick={() => {
          showModal()
          form.setFieldValue("discount", 0)
        }
        }
        > <IoMdAdd /> Tạo mới sản phẩm</Button>
        <Table columns={columns} dataSource={data} /></div>}
      <Modal title="Thêm mới sản phẩm" footer="" destroyOnClose open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          layout='vertical'
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          form={form}
        >
          <Form.Item<IProduct>
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<IProduct>
            label="Image"
            name="image"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <input type='file' multiple onChange={e => handleUpload(e)} />
            {loadingUpload ? <Loading /> : <>
                {imgUrl?.map((img: any) => {
                  console.log(img?.url);
                  return (
                    <img height={70} src={img.url} alt="" />
                  )
                })}
              </>}

            
          </Form.Item>
          <Form.Item<IProduct>
            label="Price (/Kg)"
            name="price"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <InputNumber min={1} />
          </Form.Item>

          <Form.Item<IProduct>
            label="Quantity"
            name="quantity"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item<IProduct>
            label="Discount"
            name="discount"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <InputNumber min={0} max={100} />
          </Form.Item>
          <Form.Item<IProduct>
            label="Desc"
            name="desc"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item<IProduct>
            label="Category"
            name="categoryId"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Select
              showSearch
              placeholder="Select a person"
              optionFilterProp="children"
              onChange={onChange}
              onSearch={onSearch}
              filterOption={filterOption}
              options={options}
            />
          </Form.Item>

          <Form.Item<IProduct>
            label="Sản phẩm nổi bật"
            name="outStanding"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            {/* <Select>
              <option value="false">Sản phẩm bình thường</option>
              <option value="true">Sản phẩm nổi bật</option>
            </Select> */}
            <Switch  ></Switch>
          </Form.Item>
          <Form.Item >
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {/* ============================================ FORM UPDATE============================================================== */}
      <Modal title="Upate sản phẩm" footer="" open={isModalOpenUpdate} onOk={handleOk} onCancel={handleCancel}>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          layout='vertical'
          initialValues={{ remember: true }}
          onFinish={onFinishUpdate}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          form={form}
        >
          <Form.Item<IProduct>
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<IProduct>
            label="Image"
            name="image"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <input type='file' onChange={e => handleUpload(e)} />

          </Form.Item>
          <Form.Item<IProduct>
            label="Price (/Kg)"
            name="price"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <InputNumber min={1} />
          </Form.Item>

          <Form.Item<IProduct>
            label="Quantity"
            name="quantity"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item<IProduct>
            label="Discount"
            name="discount"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <InputNumber min={0} max={100} />
          </Form.Item>
          <Form.Item<IProduct>
            label="Desc"
            name="desc"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item<IProduct>
            label="Category"
            name="categoryId"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Select
              showSearch
              placeholder="Select a person"
              optionFilterProp="children"
              onChange={onChange}
              onSearch={onSearch}
              filterOption={filterOption}
              options={options}
            />
          </Form.Item>

          <Form.Item<IProduct>
            label="Sản phẩm nổi bật"
            name="outStanding"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Switch ></Switch>
          </Form.Item>
          <Form.Item >
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ListProducts