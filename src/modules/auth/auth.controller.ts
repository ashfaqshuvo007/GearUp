import type { Request, Response } from "express";

const register = async (req: Request, res: Response) => {
  try {
    console.log("User Register Successfully");
  } catch (error) {
    console.error("Could not register user", error);
  }
};

const login = async (req: Request, res: Response) => {
  try {
    console.log("User LoggedIn Successfully");
  } catch (error) {
    console.error("Invalid Credentials", error);
  }
};
export const loggedInUser = async (req: Request, res: Response) => {
  try {
    res.send();
    console.log();
  } catch (error) {
    console.error("Invalid Credentials", error);
  }
  res.status(200).json({ message: "User LoggedIn is : Ashfaq" });
};

export const authController = {
  login,
  register,
  loggedInUser,
};
