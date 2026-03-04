import { pool } from "../config/database.js";
import { ResponseError } from "../error/ResponseError.js";
import { validation } from "../validations/validate.js";
import cloudinary from "../utils/cloudinary.js";
import {
  addBlogValidation,
  updateBlogValidation,
} from "../validations/blog-validation.js";
import {
  getBlog,
  getBlogById,
  addBlog,
  updateBlogImage,
  updateBlog,
  deleteBlog,
  getTotalBlog,
} from "../models/blog-model.js";

export const showBlog = async (limit, offset) => {
  const result = await getBlog(pool, limit, offset);
  if (result.length === 0) {
    throw new ResponseError(404, "Data blog tidak ditemukan");
  }

  return result;
};

export const showBlogById = async (blogId) => {
  const result = await getBlogById(pool, blogId);
  if (!result) {
    throw new ResponseError(404, "Data blog tidak ditemukan");
  }

  return result;
};

export const showTotalBlog = async () => {
  const result = await getTotalBlog(pool);
  if (!result) {
    throw new ResponseError(404, "Data blog tidak ditemukan");
  }

  return result;
};

export const saveBlog = async (request, file, accountId) => {
  let blogResult;

  try {
    const blog = validation(addBlogValidation, request);

    if (!file) {
      throw new ResponseError(400, "Image wajib diupload");
    }

    blogResult = await addBlog(
      pool,
      accountId,
      blog.blog_title,
      blog.blog_content,
    );
  } catch (err) {
    throw err;
  }

  try {
    const fileStr = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
    const uploadImage = await cloudinary.uploader.upload(fileStr, {
      folder: "blog_image",
    });

    await updateBlogImage(
      pool,
      uploadImage.public_id,
      uploadImage.secure_url,
      blogResult.blog_id,
    );
  } catch (err) {
    await deleteBlog(pool, blogResult.blog_id);
    throw err;
  }
};

export const editBlog = async (request, file, blogId, accountId) => {
  const client = await pool.connect();
  let existingBlog;
  let updateBlogResult;

  try {
    await client.query("BEGIN");

    existingBlog = await getBlogById(client, blogId);

    const blog = validation(updateBlogValidation, request);

    if (!existingBlog) {
      throw new ResponseError(404, "Data blog tidak ditemukan");
    }

    const data = {
      account_id: accountId ?? existingBlog.account_id,
      blog_title: blog.blog_title ?? existingBlog.blog_title,
      blog_content: blog.blog_content ?? existingBlog.blog_content,
    };

    updateBlogResult = await updateBlog(client, data, blogId);

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }

  try {
    let uploadImgId = existingBlog.blog_image_id;
    let uploadImgUrl = existingBlog.blog_image_url;
    let uploadImage;

    if (file && existingBlog.blog_image_id) {
      await cloudinary.uploader.destroy(existingBlog.blog_image_id);

      const fileStr = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

      uploadImage = await cloudinary.uploader.upload(fileStr, {
        folder: "blog_image",
      });
      uploadImgId = uploadImage.public_id;
      uploadImgUrl = uploadImage.secure_url;
    }

    await updateBlogImage(
      pool,
      uploadImgId,
      uploadImgUrl,
      updateBlogResult.blog_id,
    );
  } catch (err) {
    throw err;
  }
};

export const removeBlog = async (blogId) => {
  const client = await pool.connect();

  try {
    const existingBlog = await getBlogById(client, blogId);
    if (!existingBlog) {
      throw new ResponseError(404, "Data blog tidak ditemukan");
    }

    await deleteBlog(client, blogId);

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};
