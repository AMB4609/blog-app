import express from "express";
import {
  createBlog,
  deleteBlog,
  fetchAllBlogs,
  fetchSingleBlog,
  updateBlog,
} from "../controllers/blog.controller.js";
import { upload } from "../middlewares/multer.js";
import { isAdmin, islogin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", islogin, isAdmin, upload.single("file"), createBlog);
router.put("/:id", islogin, isAdmin, upload.single("file"), updateBlog);
router.delete("/:id", islogin, isAdmin, upload.single("file"), deleteBlog);
router.get("/:id", fetchSingleBlog);
router.get("/", fetchAllBlogs);
export default router;
