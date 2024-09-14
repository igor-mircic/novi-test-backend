import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { verify } from "jsonwebtoken";
import { User } from "../models/userModel";

export const requireAuth = async (req: any, res: any, next: any) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Authorization token required" });
  }

  const token = authorization.split(" ")[1];

  try {
    const secret = process.env.SECRET;
    if (!secret) throw Error("SECRET env variable missing");
    const { _id }: any = verify(token, secret);

    req.user = await User.findOne({ _id }).select("_id");
    next();
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Request is not authorized" });
  }
};
