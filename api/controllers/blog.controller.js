import { uploadImage } from "../helpers/cloudinary.js";
import { NotFoundError } from "../helpers/error-handler.js";
import { BlogModel } from "../models/blog.model.js";
import { findBlogById } from "../services/blog.service.js";
export const createBlog = async (req, res) => {
  try {
    const { title, content, shortDescription, tags } = req.body;

    let result;
    if (req.file) {
      result = await uploadImage(req.file);
      if (!result.public_id) {
        throw new BadRequestError("erroe while uploading to cloudinary");
      }
    }
    console.log(result);
    const blog = await BlogModel.create({
      title,
      content,
      shortDescription,
      author: req.user.id,
      coverImage: result?.secure_url || "",
      tags,
    });

    return res.status(201).json({
      message: "Blog created successfully",
      blog,
    });
  } catch (error) {
    console.log(error);
    throw new BadRequestError(error.message);
  }
};
export const updateBlog = async (req, res) => {
  try {
    const { title, content, shortDescription, tags } = req.body;
    // const blog = await findBlogById(req.params.id) delete garne bela
    let result;
    if (req.file) {
      result = await uploadImage(req.file);
      if (!result.public_id) {
        throw new BadRequestError("erroe while uploading to cloudinary");
      }
    }
    console.log(result);
    const blog = await BlogModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          title,
          content,
          shortDescription,
          coverImage: result?.secure_url,
          // ...(imageResult && {
          //   coverImage: {
          //     publicId: imageResult.public_id,
          //     url: imageResult.secure_url,
          //   },
          // }), delete garne bela
          tags,
        },
      },
      { new: true }
    );
    if (!blog) {
      throw new NotFoundError("Blog not found");
    }
    return res.status(200).json({
      message: "Blog updated successfully",
      blog,
    });
  } catch (error) {
    console.log(error);
    throw new BadRequestError(error.message);
  }
};
export const deleteBlog = async (req, res) => {
  try {
    const blog = await findBlogById(req.params.id);

    if (blog.author.toString() !== req.user.id) {
      throw new UnauthorizedError(
        "Unauthorized. Only the author can delete the blog"
      );
    }
    await BlogModel.findByIdAndDelete(blog._id);

    return res.status(200).json({
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.log(error);
    throw new BadRequestError(error.message);
  }
};
export const fetchSingleBlog = async (req, res) => {
  try {
    const blog = await BlogModel.findById(req.params.id).populate(
      "author",
      "email firstName lastName profilePicture"
    );
    if (!blog) throw new NotFoundError("blog not found");

    return res.status(200).json({
      message: "Blog fetched successfully",
      blog,
    });
  } catch (error) {
    console.log(error);
    throw new BadRequestError(error.message);
  }
};

export const fetchAllBlogs = async (req, res) => {
  try {
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 5;
    const search = +req.query.search || "";

    const skip = (page - 1) * limit;

    const query = { title: { $regex: search, $options: "i" } };

    const blogs = await BlogModel.find(query)
      .skip(skip)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("author", "email firstName lastName profilePicture");

    const total = await BlogModel.countDocuments(query);

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      message: "Blogs fetched successfully",
      blogs,
      total,
      page,
      totalPages,
    });
  } catch (error) {
    console.log(error);
    throw new BadRequestError(error.message);
  }
};
