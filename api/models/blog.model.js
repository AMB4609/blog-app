import { Schema, model } from "mongoose";

const blogSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  shortDescription: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User" },
  coverImage: { type: String, default: "" },
  // coverImage: {
  //   publicId: { type: String, default: '' },
  //   url: { type: String, default: '' },
  // }, delete garne bhaye image not directly delete and update
  tags: [{ type: String }],
  likeCount: { type: Number, default: 0 },
  commentCount: { type: Number, default: 0 },
});

export const BlogModel = model("blog", blogSchema);
