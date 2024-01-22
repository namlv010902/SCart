import Order from "../models/order"
import checkoutValidate from "../schema/checkout"
import Cart from "../models/cart"
import User from "../models/user"
import { CANCELLED_ORDER, DONE_ORDER, ORDERS, PENDING_ORDER, SUCCESS_ORDER } from "../config/constants"
import { transporter } from "../config/mail"

export const sendMailer = async (data) => {
    console.log(data);
    const formatTime = new Date(data.createdAt).toLocaleTimeString()
    await transporter.sendMail({
        from: "namphpmailer@gmail.com",
        to: data.email,
        subject: "Thông báo đặt hàng thành công ",
        html: `<div>
                      <p style="color:#2986cc;">Kính gửi Anh/chị: ${data.customerName} </p> 
                      <p style="font-weight:bold">Hóa đơn được tạo lúc: ${formatTime}</p>
                      <div style="border:1px solid #ccc;border-radius:10px; padding:10px 20px;width: max-content">
                      <p>Mã hóa đơn: ${data.invoiceId}</p>
                      <p>Khách hàng: ${data.customerName}</p>
                      <p>Điện thoại: ${data.phoneNumber}</p>
                      <p>Địa chỉ nhận hàng: ${data.address}</p>
                      <p>Hình thức thanh toán: Thanh toán khi nhận hàng</p>
                      <p>Trạng thái đơn hàng: ${data.status}</p>
                      <table style="text-align:center">
                      <thead>
                        <tr style="background-color: #CFE2F3;">
                          <th style="padding: 10px;">STT</th>
                          <th style="padding: 10px;">Sản phẩm</th>
                          <th style="padding: 10px;">Cân nặng</th>
                          <th style="padding: 10px;">Đơn giá</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${data.products
                .map(
                    (product, index) =>
                        `
              <tr style="border-bottom:1px solid #ccc">
                <td style="padding: 10px;">${index + 1}</td>
                <td style="padding: 10px;"><img alt="image" src="${product.image
                        }" style="width: 90px; height: 90px;border-radius:5px">
                <p>${product.name} </p>
                </td>
                <td>${product.quantity}</td>
                <td style="padding: 10px;">${product.price.toLocaleString(
                            "vi-VN"
                        )}VNĐ/kg</td>
              </tr>
           `
                )
                .join("")}
                      </tbody>
                    </table>  
                      <h3 style="color: red;font-weight:bold;margin-top:20px">Tổng tiền thanh toán: ${data.totalPayment.toLocaleString(
                    "vi-VN"
                )}VNĐ</h3>
                      </div>
                       <p>Xin cảm ơn quý khách!</p>
                    </div>`,
    });
};
export const createOrder = async (req, res) => {
    try {
        const { error } = checkoutValidate.validate(req.body)
        const user = req.user
        if (error) {
            return res.status(400).json({
                message: error.details.map(item => item.message)
            })
        }
        if (user != null) {
            req.body.userId = user._id
        }
        const order = await Order.create(req.body)
        if (order && user != null) {
            await Cart.findOneAndUpdate({ userId: req.user._id }, { products: [] })
            await User.findByIdAndUpdate(req.user._id, { address: req.body.address, phoneNumber: req.body.phoneNumber })
        }
        sendMailer(order)
        return res.status(201).json({
            message: "Order created successfully",
            data: order
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}
export const getOrdersForMember = async (req, res) => {
    const {
        _page = 1,
        _order = "desc",
        _limit = 999,
        _sort = "createdAt",
        _invoiceId = ""

    } = req.query
    const options = {
        page: _page,
        limit: _limit,
        sort: {
            [_sort]: _order == "desc" ? -1 : 1,
        },
    }
    try {
        const query = { userId: req.user._id }
        if (_invoiceId) {
            query.invoiceId = _invoiceId
        }
        const data = await Order.paginate(query, options)
        return res.status(200).json({
            message: "Get orders successfully",
            data
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}
export const detailOrder = async (req, res) => {
    try {
        const data = await Order.findById(req.params.id)

        return res.status(200).json({
            message: "Get order successfully",
            data
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}
export const cancelledOrder = async (req, res) => {
    try {
        const data = await Order.findById(req.params.id)
        if (data.status != PENDING_ORDER) {
            return res.status(400).json({
                message: "Đơn hàng này không được phép hủy!",
            })
        }
        await Order.findByIdAndUpdate(req.params.id, { status: CANCELLED_ORDER })

        return res.status(200).json({
            message: "Cancelled order successfully",

        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}
export const getAllOrders = async (req, res) => {
    const {
        _page = 1,
        _order = "desc",
        _limit = 999,
        _sort = "createdAt",
        _q = "",
    } = req.query
    const options = {
        page: _page,
        limit: _limit,
        sort: {
            [_sort]: _order == "desc" ? -1 : 1,
        },
    }
    try {
        const order = await Order.paginate({}, options);
        return res.status(200).json({
            message: "Get orders",
            data: order,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

export const updateOrder = async (req, res) => {
    try {
        const { status } = req.body
        const { id } = req.params
        const validate = ORDERS.includes(status)
        if (!validate) {
            return res.status(400).json({
                message: "Status invalid!",

            })
        }
        const currentOrder = await Order.findById(id);
        const currentStatusIndex = ORDERS.indexOf(currentOrder.status);
        const newStatusIndex = ORDERS.indexOf(status);
        if (newStatusIndex != currentStatusIndex + 1) {
            return res.status(401).json({
                message: "Trạng thái đơn hàng update phải theo tuần tự!",
            });
        }
        const data = await Order.findByIdAndUpdate(id, { status: status }, { new: true })
        if (status == DONE_ORDER) {
            await Order.findByIdAndUpdate(id, { pay: true })
        }
        return res.status(200).json({
            message: "Update order successfully",
            data
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

export const filterStatusOrderForMember = async (req, res) => {

    try {
        const order = await Order.find({ userId: req.user._id, status: req.params.status });
        if (order) {
            return res.status(200).json({
                message: "Filter",
                data: order,
            });
        }

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};
export const confirmOrder = async (req, res) => {
    try {
        const data = await Order.findById(req.params.id)
        if (data.status != SUCCESS_ORDER) {
            return res.status(400).json({
                message: "Status invalid!",
            })
        }
        const order = await Order.findByIdAndUpdate(req.params.id, { status: DONE_ORDER, pay: true }, { new: true });
        return res.status(200).json({
            message: "DONE",
            data: order,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};
export const findOneOrder = async (req, res) => {
    try {
        const data = await Order.findOne({ invoiceId: req.params.id })
        if (data) {
            return res.status(200).json({
                message: "OKI",
                data: [data],
            });
        }
        return res.json({
            message: "Not found",
            data: {}
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

