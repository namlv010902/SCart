import { DONE_ORDER } from "../config/constants";
import Order from "../models/order"
import Evaluation from "../models/evaluation"
export const createEvaluation = async (req, res) => {
    try {
        const { orderId, productId, customerName } = req.body

        const orderExist = await Order.findById(orderId)
        if (!orderExist) {
            return res.status(404).json({
                status: 404,
                message: "Order not found",
            });
        }
        if (orderExist.status != DONE_ORDER) {
            return res.status(400).json({
                status: 400,
                message: "Trạng thái đơn hàng chưa đạt yêu cầu!",
            });
        }
        const productExist = await Order.findOne({ _id: orderId, "products._id": productId })
        if (!productExist) {
            return res.status(404).json({
                status: 404,
                message: "Product not found in order!",
            });
        }
        // Check xem sp này trong đơn hàng đấy đã được đánh giá chưa 
        const isRated = orderExist.products.find(item => item._id == productId)
        console.log(isRated);
        if (isRated.isRate) {
            return res.status(400).json({
                status: 400,
                message: "Sản phẩm này đã được đánh giá trong đơn hàng !",
            })
        }
        const data = await Evaluation.create(req.body)
        //Update lại sp đã được đánh gái trong đơn hàng evaluation => true
        await Order.findOneAndUpdate({ _id: orderId, "products._id": productId }, {
            $set: {
                "products.$.isRate": true
            }
        }, { new: true })

        return res.status(200).json({
            status: 200,
            message: "Created rating",
            data
        })
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message,
        });
    }
}

export const getEvaluationByIdProduct = async (req, res) => {
    try {
        const productId  = req.params.id
        const data = await Evaluation.find({productId})
        return res.status(200).json({
            message:"Get rating successfully",
            status: 200,
            data
        })
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message,
        });
    }
}