import { BadRequestError } from "../helpers/error-handler.js";
import { UserModel } from "../models/user.model.js";

export const findUser = async (query) => {
  const user = await UserModel.findOne(query);
  if (!user) throw new BadRequestError(`User not found`);
  return user;
};
