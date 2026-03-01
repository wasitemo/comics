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
  const blog = validation(addBlogValidation, request);

  if (!file) {
    throw new ResponseError(400, "Image wajib diupload");
  }

  const fileStr = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
  const uploadImage = await cloudinary.uploader.upload(fileStr, {
    folder: "blog_image",
    transformation: [
      {
        width: 300,
        heigh: 300,
      },
    ],
  });
  await addBlog(
    pool,
    accountId,
    blog.blog_title,
    blog.blog_content,
    uploadImage.public_id,
    uploadImage.secure_url,
  );
};

export const editBlog = async (request, file, blogId, accountId) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const blog = validation(updateBlogValidation, request);
    const existingBlog = await getBlogById(client, blogId);

    if (!existingBlog) {
      throw new ResponseError(404, "Data blog tidak ditemukan");
    }

    let uploadImgId;
    let uploadImgUrl;
    let uploadImage;

    if (file && existingBlog.blog_image_id) {
      await cloudinary.uploader.destroy(existingBlog.blog_image_id);

      const fileStr = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

      uploadImage = await cloudinary.uploader.upload(fileStr, {
        folder: "blog_image",
        transformation: [
          {
            width: 300,
            heigh: 300,
          },
        ],
      });

      uploadImgId = uploadImage.public_id;
      uploadImgUrl = uploadImage.secure_url;
    } else {
      uploadImgId = existingBlog.blog_image_id;
      uploadImgUrl = existingBlog.blog_image_url;
    }

    const data = {
      account_id: accountId ?? existingBlog.account_id,
      blog_title: blog.blog_title ?? existingBlog.blog_title,
      blog_content: blog.blog_content ?? existingBlog.blog_content,
      blog_image_id: uploadImgId,
      blog_image_url: uploadImgUrl,
    };
    await updateBlog(client, data, blogId);

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
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
