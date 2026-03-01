import {
  showBlog,
  showBlogById,
  showTotalBlog,
  saveBlog,
  editBlog,
  removeBlog,
} from "../services/blog-service.js";

export const presentBlog = async (req, res, next) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;
    const total = await showTotalBlog();
    const result = await showBlog(limit, offset);

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

export const presentBlogById = async (req, res, next) => {
  try {
    let blogId = parseInt(req.params.blog_id);
    const result = await showBlogById(blogId);

    return res.status(200).json({
      status: 200,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const newBlog = async (req, res, next) => {
  try {
    const data = req.body;
    const file = req.file;
    const accountId = parseInt(req.user.id);

    if (!req.file) {
    }

    await saveBlog(data, file, accountId);
    return res.status(201).json({
      status: 201,
      message: "Berhasil menambahkan blog data",
    });
  } catch (err) {
    next(err);
  }
};

export const changeBlog = async (req, res, next) => {
  try {
    const data = req.body;
    const file = req.file;
    let blogId = parseInt(req.params.blog_id);
    let accountId = parseInt(req.user.id);

    await editBlog(data, file, blogId, accountId);
    return res.status(200).json({
      status: 200,
      message: "Berhasil update blog data",
    });
  } catch (err) {
    next(err);
  }
};

export const eraseBlog = async (req, res, next) => {
  try {
    let blogId = parseInt(req.params.blog_id);

    await removeBlog(blogId);
    return res.status(201).json({
      status: 201,
      message: "Berhasil menghapus blog data",
    });
  } catch (err) {
    next(err);
  }
};
