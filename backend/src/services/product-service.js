import { pool } from "../config/database.js";
import { ResponseError } from "../error/ResponseError.js";
import { validation } from "../validations/validate.js";
import cloudinary from "../utils/cloudinary.js";
import { getGenreAndId, findGenreIdByName } from "../models/genre-model.js";
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

    if (request.genre) {
      request.genre = JSON.parse(request.genre);
    }

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
      const existingGenre = await getGenreById(client, key);
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
  const existingProduct = await getProductById(client, productId);
  let productResult;

  try {
    await client.query("BEGIN");

    if (request.genre) {
      request.genre = JSON.parse(request.genre);
    }

    const product = validation(upateProductValidation, request);

    if (!existingProduct) {
      throw new ResponseError(404, "Data product tidak ditemukan");
    }

    if (product.release_date) {
      product.release_date = product.release_date.toISOString().split("T")[0];
    }

    const data = {
      account_id: accountId,
      product_title: product.product_title ?? existingProduct.product_title,
      author: product.author ?? existingProduct.author,
      release_date: product.release_date ?? existingProduct.release_date,
      price: product.price ?? existingProduct.price,
      sypnosis: product.sypnosis ?? existingProduct.sypnosis,
    };

    productResult = await updateProduct(client, data, productId);

    if (product.genre) {
      for (const key of product.genre) {
        const existingGenre = await getGenreAndId(client, key);
        if (!existingGenre) {
          throw new ResponseError(404, "Data genre tidak ditemukan");
        }

        if (product.genre.length > existingProduct.genres.length) {
          const existingProductGenre = await getproductGenre(
            client,
            productResult.product_id,
          );
          const arrayProductGenre = existingProductGenre.map(
            (data) => data.genre_id,
          );
          const inputValue1 = arrayProductGenre.filter(
            (data) => !product.genre.includes(data),
          );
          const inputValue2 = product.genre.filter(
            (data) => !arrayProductGenre.includes(data),
          );
          const finalInput = [...inputValue1, ...inputValue2];

          for (let value of finalInput) {
            await addProductGenre(client, productResult.product_id, value);
          }
        } else if (product.genre.length < existingProduct.genres.length) {
          const existingProductGenre = await getproductGenre(
            client,
            productResult.product_id,
          );
          const arrayProductGenre = existingProductGenre.map(
            (data) => data.genre_id,
          );
          const deleteValue1 = arrayProductGenre.filter(
            (value) => !product.genre.includes(value),
          );
          const deleteValue2 = product.genre.filter(
            (value) => !arrayProductGenre.includes(value),
          );
          const finalDeleteValue = [...deleteValue1, ...deleteValue2];

          for (let value of finalDeleteValue) {
            await deleteProductGenre(client, value, productResult.product_id);
          }
        } else if (product.genre.length === existingProduct.genres.length) {
          await deleteAllProductGenre(client, productResult.product_id);
          await addProductGenre(client, productId, key);
        }
      }
    } else {
      for (const key of existingProduct.genres) {
        const existingGenre = await getGenreAndId(client, key);
        if (!existingGenre) {
          throw new ResponseError(404, "Data genre tidak ditemukan");
        }

        const genreId = await findGenreIdByName(client, key);
        await updateProductGenre(
          client,
          genreId.genre_id,
          productResult.product_id,
        );
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

    await updateImage(
      pool,
      uploadImgId,
      uploadImgUrl,
      productResult.product_id,
    );
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
