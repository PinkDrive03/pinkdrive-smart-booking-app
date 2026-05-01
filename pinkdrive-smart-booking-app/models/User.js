import jwt from "jsonwebtoken";
import prisma from "../config/connect.js";

// Tạo token - hàm độc lập thay cho Mongoose methods
export const createAccessToken = (user) =>
  jwt.sign(
    { id: user.id, phone: user.phone },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );

export const createRefreshToken = (user) =>
  jwt.sign(
    { id: user.id, phone: user.phone },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );

export const findById = (id) => prisma.user.findUnique({ where: { id } });
