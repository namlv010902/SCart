import dotenv from "dotenv";
import joi from "joi";
import Product from "../models/product";
import Category from "../models/categories";
import { ObjectId } from "mongodb";

dotenv.config();

const categorySchema = joi.object({
    name: joi.string().required(),
    type: joi.string().allow(),
});

export const getAll = async (req, res) => {
    const { _page = 1,
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
        populate: "products"
    }
    try {
        const categories = await Category.paginate({}, options);
        return res.status(200).json({
            message: "Get categories",
            data: categories,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};
export const get = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id).populate("products");

        if (!category) {
            return res.json({
                message: "Category not found",
            });
        }
        return res.json({ data: category });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};
export const create = async (req, res) => {
    try {
        // validate
        const { error } = categorySchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message,
            });
        }
        const categoryExist = await Category.findOne({ type: "default" })
        if (categoryExist) {
            if (req.body.type === "default") {
                return res.status(400).json({
                    message: "Category Default already exists!",
                });
            }
        }
        const category = await Category.create(req.body);

        if (!category) {
            return res.status(400).json({
                message: "Failed",
            });
        }
        return res.status(201).json({
            message: "Created category",
            data: category,
        });
    } catch (error) {
        return res.status(400).json({
            message: error,
        });
    }
};
//Xóa danh mục
export const removeCategory = async (req, res) => {
    try {
        //Danh mục mặc định
        const cateDefault = await Category.findOne({ type: "default" })
        console.log(cateDefault);
        if (!cateDefault) {
            return res.status(400).json({
                message: "Phải tạo danh mục mặc định trước!",
            })
        }
        //Ko cho phép xóa dm mặc định
        if (cateDefault._id == req.params.id) {
            return res.status(400).json({
                message: "The category is not deleted(default)",
            })
        }

        const cate = await Category.findById(req.params.id)
        const updateCate = await Category.findByIdAndUpdate(cateDefault._id, {
            $push: {
                products: cate.products
            }
        }
        )
        //Lặp qua tất cả sp của cate để update lại categoryId => default
        for (let item of cate.products) {
            await Product.findOneAndUpdate({ categoryId: req.params.id }, {
                $set: {
                    "categoryId": cateDefault._id
                }
            })
        }
        //Xóa danh mục
        await Category.deleteOne({ _id: req.params.id })
        return res.status(200).json({
            message: "Removed",
           
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

export const updateCategory = async (req, res) => {
    try {
        const { error } = categorySchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message,
            });
        }
        const category = await Category.updateOne({ _id: req.params.id }, req.body)
        return res.json({
            message: "Updated ",
            data: category
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}