import { Button, Modal, Space, Table, TableProps, Tag, Select, Form, Input, Rate, Switch } from 'antd';
import Loading from '../../../components/Loading';
import { useGetAllEvaluationQuery, useUpdateReviewMutation } from '../../../service/evaluation.service';
import { IEvaluation } from '../../../common/evaluation';
import { formatTime } from '../../../config/formatTime';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
const ListEvaluation = () => {
    const { data, isLoading, } = useGetAllEvaluationQuery()
    const [update, { isSuccess }] = useUpdateReviewMutation()
    const dataSource = data?.data.docs

    const columns: TableProps<IEvaluation>['columns'] = [
        {
            title: 'STT',
            key: "index",
            render: (a, b, index) => <Tag color='green'>{index + 1}</Tag>,
        },
        {
            title: 'Sản phẩm',
            dataIndex: 'productId',
            key: 'productId',
            render: (_, record) => (
                <Space>
                    <Link style={{ color: "#3b9048", textTransform: "uppercase" }} to={"/products/" + record?.productId?._id}>{record?.productId?.name}</Link>
                </Space>
            )
        },
        {
            title: 'Người bình luận',
            dataIndex: 'customerName',
            key: 'customerName',
            render: (_, record) => {
                return <p >{record?.customerName}</p>
            }
        },

        {
            title: 'Nội dung',
            dataIndex: 'content',
            key: 'content',
            render: (_, record) => {
                return (
                    <>   <Rate value={record?.rate} disabled /> <br />
                        <p >{record?.content}</p>

                    </>
                )
            }
        },
        {
            title: 'Thời gian',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (_, record) => {
                const time = formatTime(record)
                return <p >{time}</p>
            }
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Switch defaultChecked={record.isReview} onChange={(e) => onChange(e, record._id)} />

                </Space>
            ),
        },

    ];

    const onChange = (checked: boolean, id: string) => {
        console.log(`switch to ${checked}`, id);
        const body = {
            id,
            isReview: checked
        }
        console.log(body);

        update(body)
    };
    return (
        <div>
            {isLoading ? <Loading /> : <div>
                <Table dataSource={dataSource} columns={columns} />
            </div>}

        </div>
    )
}

export default ListEvaluation