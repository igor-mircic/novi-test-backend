import { Document, Model, model, Schema, Types } from "mongoose";
import { compare, genSalt, hash } from "bcrypt";

interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface UserModel extends Model<IUser> {
  register(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ): Promise<Document<unknown, any, IUser> & IUser & { _id: Types.ObjectId }>;
  login(
    email: string,
    password: string
  ): Promise<Document<unknown, any, IUser> & IUser & { _id: Types.ObjectId }>;
}

const userSchema = new Schema<IUser, UserModel>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.statics.register = async function (
  firstName: string,
  lastName: string,
  email: string,
  password: string
) {
  if (!firstName) throw Error("First Name is required");
  if (!lastName) throw Error("Last Name is required");
  if (!email) throw Error("Email is required");
  if (!password) throw Error("Passwrod is required");

  if (email == "" || email.indexOf("@") == -1 || email.indexOf(".") == -1)
    throw Error("Email not valid.");

  if (password.length < 6)
    throw Error("Password should be at last 6 characters long.");

  const exists = await this.findOne({ email });

  if (exists) throw Error("Email alrady in use");

  const salt = await genSalt(10);
  const passwordHash = await hash(password, salt);

  const user = await this.create({
    firstName,
    lastName,
    email,
    password: passwordHash,
  });

  return user;
};

userSchema.statics.login = async function (email: string, password: string) {
  if (!email) throw Error("Email is required");
  if (!password) throw Error("Passwrod is required");

  const user = await this.findOne({ email });
  if (!user) throw Error("Incorrect email");

  const match = await compare(password, user.password);
  if (!match) throw Error("Incorrect password");

  return user;
};

export const User = model<IUser, UserModel>("User", userSchema);
