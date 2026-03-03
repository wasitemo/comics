import {
  showProduct,
  showProductById,
  saveProduct,
  editProduct,
  removeProduct,
  showTotalProduct,
} from "../services/product-service.js";

export const presentProduct = async (req, res, next) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;
    const total = await showTotalProduct();
    const result = await showProduct(limit, offset);

    return res.status(200).json({
      status: 200,
      page,
      limit,
      total_data: parseInt(total.count),
      total_page: Math.ceil(total.count / limit),
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const presentProductById = async (req, res, next) => {
  try {
    let productId = parseInt(req.params.product_id);
    const result = await showProductById(productId);

    return res.status(200).json({
      status: 200,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const newProduct = async (req, res, next) => {
  try {
    const body = req.body;
    const file = req.file;
    let accountId = parseInt(req.user.id);

    await saveProduct(body, file, accountId);
    return res.status(201).json({
      status: 201,
      message: "Berhasil menambahkan data product",
    });
  } catch (err) {
    next(err);
  }
};

export const changeProduct = async (req, res, next) => {
  try {
    const body = req.body;
    const file = req.file;
    let productId = parseInt(req.params.product_id);
    let accountId = parseInt(req.user.id);

    await editProduct(body, file, accountId, productId);
    return res.status(200).json({
      status: 200,
      message: "Berhasil update data product",
    });
  } catch (err) {
    next(err);
  }
};

export const eraseProduct = async (req, res, next) => {
  try {
    let productId = parseInt(req.params.product_id);

    await removeProduct(productId);
    return res.status(201).json({
      status: 201,
      message: "Berhasil delete data product",
    });
  } catch (err) {
    next(err);
  }
};
