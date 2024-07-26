import { NotFoundError } from "../helpers/error-handler.js";
import { BlogModel } from "../models/blog.model.js";

export const findBlogById = async (id) => {
  const blog = await BlogModel.findById(id);
  if (!blog) throw new NotFoundError(`Blog with id ${id} not found`);
  return blog;
};
