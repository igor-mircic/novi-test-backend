import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { sign } from "jsonwebtoken";
import { ObjectId } from "mongodb";

import { User } from "../models/userModel";
import {
  LoginUserRequestBodyDto,
  LoginUserResponseBodyDto,
  RegisterUserRequestBodyDto,
  RegisterUserResponseBodyDto,
} from "../dtos/user.dtos";
import { ErrorResponseBodyDto } from "../dtos/error.dtos";

const createToken = (_id: ObjectId): string => {
  const secret = process.env.SECRET;

  if (!secret) throw Error("SECRET env variable not found.");

  return sign({ _id }, secret, { expiresIn: "1d" });
};

export const loginUser = async (
  req: Request<{}, {}, LoginUserRequestBodyDto>,
  res: Response<LoginUserResponseBodyDto | ErrorResponseBodyDto>
) => {
  try {
    const { email, password } = req.body;
    const user = await User.login(email, password);

    const token = createToken(user._id);

    res.status(StatusCodes.OK).json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      token,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
  }
};

export const registerUser = async (
  req: Request<{}, {}, RegisterUserRequestBodyDto>,
  res: Response<RegisterUserResponseBodyDto | ErrorResponseBodyDto>
) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const user = await User.register(firstName, lastName, email, password);

    const token = createToken(user._id);

    res.status(StatusCodes.OK).json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      token,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
  }
};
