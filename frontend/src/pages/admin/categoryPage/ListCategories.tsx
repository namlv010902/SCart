import { Button, Modal, Space, Table, TableProps, Tag, Select, Form, Input } from 'antd';
import React, { useEffect, useState } from 'react'
import { ICategory } from '../../../common/category';
import { useCreateCategoryMutation, useGetAllCategoryQuery, useGetCategoryByIdMutation, useRemoveCategoryMutation, useUpdateCategoryMutation } from '../../../services/category.service';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import { MdEditSquare } from 'react-icons/md';
import Loading from '../../../components/Loading';
import { toast } from 'react-toastify';
import { IoMdAdd } from "react-icons/io";
const ListCategories = () => {
  const { data, isLoading, isSuccess } = useGetAllCategoryQuery()
  const dataSource = data?.data.docs
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenUpdate, setIsModalOpenUpdate] = useState(false);
  const [createCategory, { error, isSuccess: addCateSuccess }] = useCreateCategoryMutation()
  const [form] = Form.useForm()
  const [remove, { isSuccess: deleteSuccess }] = useRemoveCategoryMutation()
  const [update, { isSuccess: updateSuccess }] = useUpdateCategoryMutation()
  const [idCategory, setIdCategory] = useState("")
  const [dataCateById, { isSuccess: getCateSuccess, data: dataCate }] = useGetCategoryByIdMutation()

  useEffect(() => {
    if (updateSuccess) {
      setIsModalOpenUpdate(false)
      toast.success("Updated category successfully")
      return
    }
    const defaultCategory = dataSource?.find((item: ICategory) => item.type == "default")
    if (defaultCategory) {
      form.setFieldValue("type", "normal")
    }
  }, [isSuccess, updateSuccess])

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message, {
        autoClose: 3000
      })
      // alert(error?.data?.message)
      // console.log(error?.data?.message);

      return
    }
    if (addCateSuccess) {
      toast.success("Thêm danh mục thành công", {
        autoClose: 3000
      })
      setIsModalOpen(false)
      return
    }
  }, [error, addCateSuccess])

  useEffect(() => {
    if (idCategory) {
      dataCateById(idCategory)
    }
  }, [idCategory])
  useEffect(() => {
    if (getCateSuccess) {
      form.setFieldValue("name", dataCate?.data?.name);
      form.setFieldValue("type", dataCate?.data?.type);
    }
  }, [getCateSuccess])
  const showModal = () => {
    setIsModalOpen(true);
  };
  const showModalUpdate = () => {
    setIsModalOpenUpdate(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
    setIsModalOpenUpdate(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsModalOpenUpdate(false);
  };
  const onFinish = (values: ICategory) => {
    console.log('Success:', values);
    createCategory(values)
  };
  const onFinishUpdate = (values: ICategory) => {
    console.log('Success:', values);
    const dataUpdate = {
      _id: idCategory,
      data: values
    }
    update(dataUpdate)
  };
  const options = [
    {
      label: "Bình thường",
      value: "normal"
    },
    {
      label: "Mặc định (Chưa phân loại)",
      value: "default"
    }
  ]
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  const columns: TableProps<ICategory>['columns'] = [
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
      title: 'Products',
      dataIndex: 'products',
      key: 'products',
      render: (_, data) => {
        return <Tag color="blue">{data?.products?.length}</Tag>
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          {record.type != "default" && <Button onClick={() => handleRemove(record._id)}><RiDeleteBin5Fill /></Button>}
          <Button onClick={() => {
            showModalUpdate()
            setIdCategory(record._id)
          }}><MdEditSquare /></Button>
        </Space>
      ),
    },

  ];
  useEffect(() => {
    if (deleteSuccess) {

    }
  }, [deleteSuccess])
  const handleRemove = (id: string) => {
    if (window.confirm('Are you sure you want to remove')) {
      remove(id)
    }
  }
  return (
    <div>
      {isLoading ? <Loading /> : <div>
        <h3>List categories</h3>
        <Button type='primary' style={{ backgroundColor: "#3b9048", margin: "20px 0" }} onClick={showModal}><IoMdAdd /> Tạo mới danh mục</Button>
        <Table dataSource={dataSource} columns={columns} />
      </div>}
      <Modal title="Thêm mới danh mục" footer="" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Form
          layout='vertical'
          name="basic"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          form={form}
        >
          <Form.Item<ICategory>
            label="Category name"
            name="name"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<ICategory>
            label="Category type"
            name="type"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Select
              options={options}
            />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {/* ==================================================Update Categories=================================== */}

      <Modal title="Update danh mục" open={isModalOpenUpdate} footer="" onCancel={handleCancel}>
        <Form
          layout='vertical'
          name="basic"
          onFinish={onFinishUpdate}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          form={form}
        >
          <Form.Item<ICategory>
            label="Category name"
            name="name"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<ICategory>
            label="Category type"
            name="type"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Select
              options={options}
            />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ListCategories