import { registerUser,  updateProfile,changePassword,forgotPassword,resetPassword, getAllUsers,getUserById, banUser,
  unbanUser,getBannedUsers, getUserTransactions,getLoginHistory } from "./user.service.js";

/**
 * Messages thrown on purpose by the service ("User with this email already
 * exists.") are safe to show; database / SMTP / network errors are not - a raw
 * Prisma error can even echo the submitted (hashed) password back.
 */
const publicMessage = (error, fallback) => {
  const internal =
    String(error?.name || "").startsWith("PrismaClient") ||
    (typeof error?.code === "string" && /^(P\d{4}|E[A-Z]+)$/.test(error.code)) ||
    error?.responseCode !== undefined ||
    error?.syscall !== undefined;
  if (!internal) return error?.message || fallback;
  if (error?.code === "P2002") return "An account with these details already exists.";
  console.error("[user]", error?.message);
  return fallback;
};

export const signup = async (req, res) => {
  try {
    const data = await registerUser(req.body, req.user.mobile);

    res.cookie("refreshToken", data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict", 
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: data.user,
      accessToken: data.accessToken,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: publicMessage(error, "Could not create your account. Please check your details and try again."),
    });
  }
};

export const updateProfileController =
async (req, res) => {

  try {

    const user =
      await updateProfile(
        req.user.id,
        req.body
      );

    res.status(200).json({
      success: true,
      message:
        "Profile updated successfully",
      data: user,
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const changePasswordController =
async (req, res) => {

  try {

    const result =
      await changePassword(
        req.user.id,
        req.body
      );

    res.status(200).json(result);

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const forgotPasswordController =
async (req,res) => {

  try {
    const result =
      await forgotPassword(
        req.body?.email
      );

    res.json(result);
  } catch (error) {
    // Previously an unhandled rejection (500 HTML page); now a JSON error the apps can show.
    res.status(400).json({
      success: false,
      message: publicMessage(error, "Could not send the reset email right now. Please try again later."),
    });
  }
};

export const resetPasswordController =
async (req,res) => {

  try {
    const result =
      await resetPassword(
        req.body?.token,
        req.body?.newPassword,
        req.body?.confirmPassword
      );

    res.json(result);
  } catch (error) {
    // Invalid / expired / already-used token → 400 JSON instead of a 500 HTML crash page.
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// 🔥 ADMIN GET ALL USERS

export const getAllUsersController =
async (req, res) => {

  const result =
    await getAllUsers();

  res.status(
    result.success ? 200 : 400
  ).json(result);
};

// 🔥 ADMIN GET USER BY ID

export const getUserByIdController =
async (req, res) => {

  const result =
    await getUserById(
      req.params.id
    );

  res.status(
    result.success ? 200 : 404
  ).json(result);
};

// 🔥 BAN USER

export const banUserController =
async (req, res) => {

  const result =
    await banUser(
      req.params.id
    );

  res.status(
    result.success ? 200 : 404
  ).json(result);
};

// 🔥 UNBAN USER

export const unbanUserController =
async (req, res) => {

  const result =
    await unbanUser(
      req.params.id
    );

  res.status(
    result.success ? 200 : 404
  ).json(result);
};
// 🔥 GET ALL BANNED USERS

export const getBannedUsersController =
async (req, res) => {

  const result =
    await getBannedUsers();

  res.status(
    result.success ? 200 : 400
  ).json(result);
};

// 🔥 GET USER TRANSACTIONS

export const getUserTransactionsController =
async (req, res) => {

  const result =
    await getUserTransactions(
      req.params.id
    );

  res.status(
    result.success ? 200 : 400
  ).json(result);
};

// 🔥 GET LOGIN HISTORY

export const getLoginHistoryController =
async (req, res) => {

  const result =
    await getLoginHistory(
      req.params.id
    );

  res.status(
    result.success ? 200 : 400
  ).json(result);
};