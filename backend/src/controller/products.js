
import Products from "../models/product";
import Category from "../models/categories";
import { validateProduct } from "../schema/product"


export const getAll = async (req, res) => {
  const { _page = 1,
    _order = "desc",
    _limit = 999,
    _sort = "createdAt",
    _q = "",
    _categoryId = "",
    _minPrice = "",
    _maxPrice = "",
    _isSale = ""
  } = req.query
  const options = {
    page: _page,
    limit: _limit,
    sort: {
      [_sort]: _order == "desc" ? -1 : 1,
    },
   populate:"categoryId"
  }
  try {   //find().populate('categoryId')
    const query = {}
    if (_q) {
      query.name = { $regex: _q, $options: "i" };
    }
    if (_categoryId) {
      query.categoryId = _categoryId
    }
    if(_isSale=="true"){
      query.discount ={$gte:0,$ne: 0}
      console.log(_isSale,"sale");
    }
    if (_minPrice && _maxPrice) {
      console.log(_minPrice, _maxPrice);
      // query.price >= _minPrice && query.price <= _maxPrice
      query.price = { $gte: _minPrice, $lte: _maxPrice };
     
    }
    const products = await Products.paginate(query, options)
    if (products.length === 0) {
      return res.jon({
        message: "Ko có sản phẩm"
      })
    } else {
      return res.status(200).json({
        message: "Get products",
        data: products
      })
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message
    })

  }
}
export const get = async (req, res) => {
  try {
    const products = await Products.findById(req.params.id).populate("categoryId")
    if (!products) {
      return res.status(404).jon({
        message: "Product not found"
      })
    } else {
      return res.status(200).json({
        message: "Get product successfully",
        data: products
      })
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message
    })

  }
}
export const create = async (req, res) => {
  try {

    const { error } = validateProduct.validate(req.body, { abortEarly: false })
    if (error) {
      return res.status(400).json({
        message: error.details.map((item) => item.message)
      })
    }
    const products = await Products.create(req.body)
    await Category.findByIdAndUpdate(products.categoryId, {
      $addToSet: {
        products: products._id,
      },
    });
    return res.status(201).json({
      message: "Created product",
      data: products
    })

  } catch (error) {
    return res.status(500).json({
      message: error.message
    })

  }
}

export const update = async (req, res) => {
  try {
    const { categoryId } = req.body;
    const product = await Products.findById(req.params.id);

    // Update new category
    await Category.findByIdAndUpdate(product.categoryId, {
      $pull: {
        products: product._id,
      },
    });
    await Category.findByIdAndUpdate(categoryId, {

      $addToSet: {
        products: product._id,
      },
    });

    // Remove product from old category
    const updatedProduct = await Products.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    return res.json({
      message: "updated",
      data: updatedProduct,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    })
  }
};

export const remove = async (req, res) => {
  try {
    const { id } = req.params;

    // Remove product from category
    const product = await Products.findById(id);
    if (product.categoryId) {
      await Category.findByIdAndUpdate(product.categoryId, {
        $pull: {
          products: product._id,
        },
      });
    }

    // Remove product data
    const deletedProduct = await Products.findByIdAndDelete(id);

    return res.json({
      message: "Đã xóa",
      data: deletedProduct,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    })
  }
};

export const relatedProducts = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const products = await Products.find({ categoryId })
    return res.json({
      message: "success",
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    })
  }
};