import { adminSignup, adminLogin, refreshAdminToken, logoutAdmin,changePassword, forgotPassword,
  resetPassword, } from "./adminauth.service.js";

// 🔹 Signup
export const signupAdmin = async (req, res) => {
  try {
    const result = await adminSignup(req.body);

    return res.status(result.success ? 201 : 400).json(result);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 🔹 Login
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    const result = await adminLogin(email, password);

    return res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const refreshTokenAdmin = async (
  req,
  res
) => {

  const { refreshToken } = req.body;

  const result =
    await refreshAdminToken(
      refreshToken
    );

  res.status(
    result.success ? 200 : 401
  ).json(result);
};

export const adminLogout = async (
  req,
  res
) => {
  const { refreshToken } = req.body;
  const result =
    await logoutAdmin( refreshToken);

  res.status(200).json(result);
};

export const changePasswordAdmin =
  async (req, res) => {
    try {
      const {
        oldPassword,
        newPassword,
      } = req.body;

      const adminId =
        req.admin.adminId;

      const result =
        await changePassword(
          adminId,
          oldPassword,
          newPassword
        );

      return res
        .status(
          result.success ? 200 : 400
        )
        .json(result);

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  export const forgotPasswordAdmin =
  async (req, res) => {
    try {

      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required",
        });
      }

      const result =
        await forgotPassword(email);

      return res.status(
        result.success ? 200 : 400
      ).json(result);

    } catch (error) {

      return res.status(500).json({
        success: false,
        message: error.message,
      });

    }
  };

  export const resetPasswordAdmin =
  async (req, res) => {

    try {

      const {
        token,
        password,
      } = req.body;

      if (!token || !password) {
        return res.status(400).json({
          success: false,
          message:
            "Token and password are required.",
        });
      }

      const result =
        await resetPassword(
          token,
          password
        );

      return res.status(
        result.success ? 200 : 400
      ).json(result);

    } catch (error) {

      return res.status(500).json({
        success: false,
        message: error.message,
      });

    }

  };