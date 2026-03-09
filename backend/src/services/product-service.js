import { pool } from "../config/database.js";
import { ResponseError } from "../error/ResponseError.js";
import { validation } from "../validations/validate.js";
import cloudinary from "../utils/cloudinary.js";
import {
  getGenreAndId,
  findGenreIdByName,
  findGenreIdById,
} from "../models/genre-model.js";
import {
  addProductValidation,
  upateProductValidation,
} from "../validations/product-validation.js";
import {
  getproductGenre,
  addProductGenre,
  updateProductGenre,
  deleteProductGenre,
  deleteAllProductGenre,
} from "../models/product-genre.js";
import {
  getProduct,
  getProductById,
  addProduct,
  updateProduct,
  updateImage,
  deleteProduct,
  getTotalProduct,
} from "../models/product-model.js";

export const showProduct = async (limit, offset) => {
  const result = await getProduct(pool, limit, offset);
  if (result.length === 0) {
    throw new ResponseError(404, "Data product tidak ditemukan");
  }

  return result;
};

export const showProductById = async (productId) => {
  const result = await getProductById(pool, productId);
  if (!result) {
    throw new ResponseError(404, "Data product tidak ditemukan");
  }

  return result;
};

export const showTotalProduct = async () => {
  const result = await getTotalProduct(pool);
  if (!result) {
    throw new ResponseError(404, "Data product tidak ditemukan");
  }

  return result;
};

export const showGenreAndId = async () => {
  const result = await getGenreAndId(pool);
  if (result.length === 0) {
    throw new ResponseError(404, "Data genre tidak ditemukan");
  }

  return result;
};

export const saveProduct = async (request, file, accountId) => {
  const client = await pool.connect();
  let productResult;

  try {
    await client.query("BEGIN");

    const product = validation(addProductValidation, request);

    product.release_date = product.release_date.toISOString().split("T")[0];

    if (!file) {
      throw new ResponseError(400, "Image wajib diisi");
    }

    productResult = await addProduct(
      client,
      accountId,
      product.product_title,
      product.author,
      product.release_date,
      product.price,
      product.sypnosis,
    );

    for (let key of product.genre) {
      const existingGenre = await findGenreIdById(client, key);
      if (!existingGenre) {
        throw new ResponseError(404, "Data genre tidak ditemukan");
      }

      await addProductGenre(client, productResult.product_id, key);
    }

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }

  try {
    const fileStr = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
    const uploadImage = await cloudinary.uploader.upload(fileStr, {
      folder: "product_image",
    });

    await updateImage(
      pool,
      uploadImage.public_id,
      uploadImage.secure_url,
      productResult.product_id,
    );
  } catch (err) {
    await deleteProduct(pool, productResult.product_id);
    throw err;
  }
};

export const editProduct = async (request, file, accountId, productId) => {
  const client = await pool.connect();
  let existingProduct;
  let parsingDate;

  try {
    await client.query("BEGIN");

    const product = validation(upateProductValidation, request);

    existingProduct = await getProductById(client, productId);

    if (!existingProduct) {
      throw new ResponseError(404, "Data product tidak ditemukan");
    }

    if (product.release_date) {
      parsingDate = product.release_date.toISOString().split("T")[0];
    }

    const data = {
      account_id: accountId,
      product_title: product.product_title ?? existingProduct.product_title,
      author: product.author ?? existingProduct.author,
      release_date: parsingDate ?? existingProduct.release_date,
      price: product.price ?? existingProduct.price,
      sypnosis: product.sypnosis ?? existingProduct.sypnosis,
    };

    await updateProduct(client, data, productId);

    if (product.genre) {
      await deleteAllProductGenre(client, productId);

      for (const genreId of product.genre) {
        const existingGenre = await findGenreIdById(client, genreId);
        if (!existingGenre) {
          throw new ResponseError(404, "Data genre tidak ditemukan");
        }

        await addProductGenre(client, productId, genreId);
      }
    }

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }

  try {
    let uploadImgId = existingProduct.product_image_id;
    let uploadImgUrl = existingProduct.product_image_url;
    let uploadImg;

    if (file && existingProduct.product_image_id) {
      await cloudinary.uploader.destroy(existingProduct.product_image_id);

      const fileStr = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
      uploadImg = await cloudinary.uploader.upload(fileStr, {
        folder: "product_image",
      });

      uploadImgId = uploadImg.public_id;
      uploadImgUrl = uploadImg.secure_url;
    }

    await updateImage(pool, uploadImgId, uploadImgUrl, productId);
  } catch (err) {
    throw err;
  }
};

export const removeProduct = async (productId) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const existingProduct = await getProductById(client, productId);
    if (!existingProduct) {
      throw new ResponseError(404, "Data product tidak ditemukan");
    }

    await deleteProduct(client, productId);

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};
