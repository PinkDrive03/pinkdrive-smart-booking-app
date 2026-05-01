import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthenticatedError } from "../errors/index.js";
import jwt from "jsonwebtoken";
import prisma from "../config/connect.js";
import { createAccessToken, createRefreshToken } from "../models/User.js";

export const auth = async (req, res) => {
  const { phone, role } = req.body;

  if (!phone) {
    throw new BadRequestError("Phone number is required");
  }

  if (!role || !["customer", "rider"].includes(role)) {
    throw new BadRequestError("Valid role is required (customer or rider)");
  }

  // Tìm user hoặc tạo mới (upsert)
  let user = await prisma.user.findUnique({ where: { phone } });

  if (user) {
    if (user.role !== role) {
      throw new BadRequestError("Phone number and role do not match");
    }

    return res.status(StatusCodes.OK).json({
      message: "User logged in successfully",
      user,
      access_token: createAccessToken(user),
      refresh_token: createRefreshToken(user),
    });
  }

  user = await prisma.user.create({ data: { phone, role } });

  res.status(StatusCodes.CREATED).json({
    message: "User created successfully",
    user,
    access_token: createAccessToken(user),
    refresh_token: createRefreshToken(user),
  });
};

export const refreshToken = async (req, res) => {
  const { refresh_token } = req.body;
  if (!refresh_token) {
    throw new BadRequestError("Refresh token is required");
  }

  try {
    const payload = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);
    const user = await prisma.user.findUnique({ where: { id: payload.id } });

    if (!user) {
      throw new UnauthenticatedError("Invalid refresh token");
    }

    res.status(StatusCodes.OK).json({
      access_token: createAccessToken(user),
      refresh_token: createRefreshToken(user),
    });
  } catch (error) {
    throw new UnauthenticatedError("Invalid refresh token");
  }
};
