import React from 'react'
import {Spin} from "antd"
import { LoadingOutlined } from '@ant-design/icons'
const Loading = () => {
    return (
        <div style={{textAlign:"center"}} ><Spin indicator={<LoadingOutlined style={{ fontSize: 50 }} spin />} />
        </div>
    )
}

export default Loading