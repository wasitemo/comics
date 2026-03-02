import {
  showGenre,
  showGenreById,
  saveGenre,
  editGenre,
  removeGenre,
  showTotalGenre,
} from "../services/genre-service.js";

export const presentGenre = async (req, res, next) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;
    const total = await showTotalGenre();
    const result = await showGenre(limit, offset);

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

export const presentGenreById = async (req, res, next) => {
  try {
    let genreId = parseInt(req.params.genre_id);
    const result = await showGenreById(genreId);

    return res.status(200).json({
      status: 200,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const newGenre = async (req, res, next) => {
  try {
    const body = req.body;
    let accountId = parseInt(req.user.id);

    await saveGenre(body, accountId);
    return res.status(201).json({
      status: 201,
      message: "Berhasil menambahkan genre data",
    });
  } catch (err) {
    next(err);
  }
};

export const changeGenre = async (req, res, next) => {
  try {
    const body = req.body;
    let accountId = parseInt(req.user.id);
    let genreId = parseInt(req.params.genre_id);

    await editGenre(body, accountId, genreId);
    return res.status(200).json({
      status: 200,
      message: "Berhasil update genre data",
    });
  } catch (err) {
    next(err);
  }
};

export const eraseGenre = async (req, res, next) => {
  try {
    let genreId = parseInt(req.params.genre_id);

    await removeGenre(genreId);
    return res.status(201).json({
      status: 201,
      message: "Berhasil menghapus genre data",
    });
  } catch (err) {
    next(err);
  }
};
