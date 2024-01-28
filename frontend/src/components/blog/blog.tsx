import React from 'react'
import { Card } from 'antd';
import "./blog.css"
const Blog = () => {
    const data = [
        { image: "https://adoring-store-demo.myshopify.com/cdn/shop/files/ba4.jpg?v=1664870356", title: "The most useful things for you", content: "I got my first premium designer bag when I was in middle school. It was something I wished for, pined for, dreamed..." },
        { image: "http://wpdemo.magikthemes.com/brezza/wp-content/uploads/sites/8/2016/01/blog-img1-2.jpg", title: "Latest News Are On Top All Times", content: "I got my first premium designer bag when I was in middle school. It was something I wished for, pined for, dreamed..." },
        { image: "http://wpdemo.magikthemes.com/brezza/wp-content/uploads/sites/8/2016/01/blog-img3-2.jpg", title: "Do you really understand yourself?", content: "I got my first premium designer bag when I was in middle school. It was something I wished for, pined for, dreamed..." },

    ]
    return (
        <>
            <div className='blog'>
                {data.map((item: any) => (
                    <div className="blog-item">
                        <div className="blog-img">
                            <img src={item.image} alt="" />
                        </div>
                        <div className="blog-content">
                            <h3>{item.title}</h3>
                            <p> {item.content}</p>
                        </div>
                    </div>
                ))}


            </div>
        </>
    )
}

export default Blog