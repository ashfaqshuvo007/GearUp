import bcrypt from "bcrypt";
import config from "../config";
const HASH_SALT = Number(config.hash_salt);
import jwt, { type JwtPayload } from "jsonwebtoken";

export const encrypt = async (stringToEncrypt: string) => {
  return await bcrypt.hash(stringToEncrypt, HASH_SALT);
};

export const compare = async (
  stringToCompare: string,
  compareAgainst: string,
) => {
  return await bcrypt.compare(stringToCompare, compareAgainst);
};

export const verifyToken = async (token: string, secret: string) => {
  try {
    const verifiedToken = jwt.verify(token, secret);
    return {
      sucess: true,
      data: verifiedToken,
    };
  } catch (error) {
    console.log("Token Verification Failed!", error);
    return {
      success: false,
      error: (error as Error).message,
    };
  }
};
