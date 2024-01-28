import { UpOutlined } from '@ant-design/icons'
import { animateScroll as scroll } from "react-scroll";

const ScrollToTop = () => {
    return (
        <div>
            <UpOutlined id='scroll' onClick={() => scroll.scrollToTop()} rev={undefined} />
        </div>
    )
}

export default ScrollToTop