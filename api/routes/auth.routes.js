import {
  forgotPassword,
  loginUser,
  registerUser,
  resendEmail,
  resetPasswords,
  verifyEmail,
} from "../controllers/auth.controller.js";
import express from "express";
import {
  loginUserValidator,
  registerUserValidator,
} from "../validations/authValidator.js";
import { isAdmin, islogin } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.post("/register", registerUserValidator, registerUser);
router.post("/login", loginUserValidator, loginUser);
router.put("/verify-email/:token", verifyEmail);
router.put("/resend-email", resendEmail);
router.put("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPasswords);
router.get("/test", islogin, isAdmin, (req, res) => {
  res.send("hello");
});
export default router;
