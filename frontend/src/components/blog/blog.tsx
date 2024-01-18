import React from 'react'
import { Card } from 'antd';
import "./blog.css"
const Blog = () => {
    const { Meta } = Card;
    return (
        <>
            <h1 className='title' style={{ textAlign: "center", fontWeight: "400" }}><p>BLOGS</p></h1>
            <div className='blog'>
                <Card
                    hoverable
                    style={{ width: 240 }}
                    cover={<img alt="example" src="https://demo.s-cart.org/data/content/blog-1.jpg" />}>
                    <Meta title="Cau Vang" description="
Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua" />
                </Card>
                <Card
                    hoverable
                    style={{ width: 240 }}
                    cover={<img alt="example" src="https://demo.s-cart.org/data/content/blog-1.jpg" />}>
                    <Meta title="Cau Vang" description="
Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua" />
                </Card>
                <Card
                    hoverable
                    style={{ width: 240 }}
                    cover={<img alt="example" src="https://demo.s-cart.org/data/content/blog-1.jpg" />}>
                    <Meta title="Cau Vang" description="
Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua" />
                </Card>
            </div>
        </>
    )
}

export default Blog