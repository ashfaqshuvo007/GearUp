import { ActiveStatus, Role } from "../../../prisma/generated/prisma/enums";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { compare, encrypt } from "../../utils/encrypt";
import type { ILoginUser, IUser } from "./auth.interface";
import jwt, { type JwtPayload } from "jsonwebtoken";

const registerUser = async (payload: IUser) => {
  const { name, email, password, role, status } = payload;
  const hashPassword = await encrypt(password);

  const isUserExist = await prisma.user.findUnique({
    where: { email },
  });

  if (isUserExist) {
    throw new Error("User with this email already exists!");
  }

  const createdUser = await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: hashPassword,
      status: status ?? ActiveStatus.ACTIVE,
      role: role ?? Role.CUSTOMER,
    },
  });

  const user = await prisma.user.findUnique({
    where: {
      id: createdUser.id,
    },
    omit: { password: true },
    include: {
      orders: true,
      reviews: true,
    },
  });

  return user;
};

const loginUser = async (payload: ILoginUser) => {
  const { email, password } = payload;
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid Credentials!");
  }

  const matchPassword = await compare(password, user.password);

  if (!matchPassword) {
    throw new Error("Invalid Credentials!");
  }

  const userPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
  // if match found generate token with TTL
  const token = jwt.sign(userPayload, config.jwt_secret as string, {
    expiresIn: "1d",
  });

  //Refresh token
  const refreshToken = jwt.sign(userPayload, config.refresh_secret as string, {
    expiresIn: "10d",
  });

  const result = {
    accessToken: token,
    refreshToken: refreshToken,
    user: userPayload,
  };

  return result;
};

const loggedInUser = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
    omit: { password: true },
    include: {
      reviews: true,
      orders: true,
    },
  });
};

const generateRefreshToken = async (token: string) => {
  //* Check refresh token in cookies
  if (!token) {
    throw new Error("Unauthorized");
  }

  const decodedToken = jwt.verify(
    token as string,
    config.refresh_secret as string,
  ) as JwtPayload;

  const userData = await prisma.user.findUnique({
    where: {
      id: decodedToken.id,
    },
  });

  //* Check user existss
  if (!userData) {
    throw new Error("User not Found");
  }

  const userPayload = {
    id: userData.id,
    name: userData.name,
    role: userData.role,
  };

  // if match found generate token with TTL
  const accessToken = jwt.sign(userPayload, config.jwt_secret as string, {
    expiresIn: "1d",
  });

  return { accessToken };
};

export const authService = {
  registerUser,
  loginUser,
  loggedInUser,
  generateRefreshToken,
};
