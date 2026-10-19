import jwt from "jsonwebtoken";


export const generateTokens = (user) => {
  const payload = { id: user.id, email: user.email };
  
  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

  return { accessToken, refreshToken };
};


export const generateAdminTokens = (admin) => {
  const payload = {
    adminId: admin.id,
    role: admin.role,
    type: "admin" // 🔥 important
  };

  const accessToken = jwt.sign(
    payload,
    process.env.ADMIN_JWT_ACCESS_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    payload,
    process.env.ADMIN_JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

export const generateTempToken = (mobile) => {
  const payload = {
    mobile,
    type: "temp", // 🔥 important for middleware
  };

  const tempToken = jwt.sign(
    payload,
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "10m" }
  );

  return tempToken;
};