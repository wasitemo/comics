import {
  showAccount,
  showTotalAccount,
  register,
  login,
  refresh,
  logout,
  editAccount,
} from "../services/account-service.js";

export const presentAccount = async (req, res, next) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 5;
    let offset = (page - 1) * limit;
    const total = await showTotalAccount();
    const result = await showAccount(limit, offset);

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

export const registerAccount = async (req, res, next) => {
  try {
    const data = req.body;

    await register(data);
    return res.status(201).json({
      status: 201,
      message: "Berhasil register",
    });
  } catch (err) {
    next(err);
  }
};

export const loginAccount = async (req, res, next) => {
  try {
    const data = req.body;
    const { refresh_token, access_token } = await login(data);

    res.cookie("token", refresh_token, {
      httpOnly: true,
      secure: false,
      samsite: "lax",
      maxAge: parseInt(process.env.MAX_AGE_COOKIE),
    });
    return res.status(200).json({
      status: 200,
      access_token,
    });
  } catch (err) {
    next(err);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const newAccessToken = await refresh(token);

    return res.status(200).json({
      status: 200,
      new_access_token: newAccessToken,
    });
  } catch (err) {
    next(err);
  }
};

export const logoutAccount = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (req.cookies.token) {
      res.clearCookie("token");
    }

    await logout(token);
    return res.status(201).json({
      status: 201,
      message: "Berhasil logout",
    });
  } catch (err) {
    next(err);
  }
};

export const changeAccount = async (req, res, next) => {
  try {
    let accountId = parseInt(req.params.account_id);
    const data = req.body;

    await editAccount(data, accountId);
    return res.status(200).json({
      status: 200,
      message: "Berhasil update data account",
    });
  } catch (err) {
    next(err);
  }
};
