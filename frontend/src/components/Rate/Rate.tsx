import React, { useEffect, useState } from 'react'
import "./Rate.css"
import { Rate } from "antd"
import { useGetEvaluationByIdProductQuery } from '../../services/evaluation.service'
import { formatTime } from '../../config/formatTime'
import { IEvaluation } from '../../common/evaluation'
const Rating = (props: any) => {
    const { data } = props?.id ? useGetEvaluationByIdProductQuery(props.id) : { data: undefined }
    const [sum, setSum] = useState(0)
    // console.log(data?.data?.rate);
    let avg = 0
    useEffect(() => {
        setSum(avg);
    }, [data])
    const avgRate = sum / data?.data?.length
    return (
        <div >
            <h3 style={{ color: "#3b9048", fontWeight: "500", marginTop: "40px", marginBottom: "20px" }}>Rating:(<Rate allowHalf disabled value={avgRate} />)</h3>
            <div className="review">
                {data?.data?.map((item: IEvaluation) => {
                    avg += item.rate
                    const time = formatTime(item)
                    return (
                        <div className="review-item">
                            <div className="review-header">
                                <span className="username">{item.customerName}</span>
                                <span className="date">({time})</span>
                            </div>
                            <div className="rating">
                                <Rate disabled value={item.rate} />

                            </div>
                            <div className="content">
                                {item.isReview ? <p> {item?.content}</p> : <p>Nội dung đã bị ẩn</p>}
                            </div>
                        </div>
                    )
                })}


            </div>
        </div>
    )
}

export default Rating