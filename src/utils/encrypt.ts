import bcrypt from "bcrypt";
import config from "../config";
const HASH_SALT = Number(config.hash_salt);

export const encrypt = async (stringToEncrypt: string) => {
  return await bcrypt.hash(stringToEncrypt, HASH_SALT);
};

export const compare = async (
  stringToCompare: string,
  compareAgainst: string,
) => {
  return await bcrypt.compare(stringToCompare, compareAgainst);
};
