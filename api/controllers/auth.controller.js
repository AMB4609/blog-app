import jwt from "jsonwebtoken";
import { BadRequestError, NotFoundError } from "../helpers/error-handler.js";
import { UserModel } from "../models/user.model.js";
import { findUser } from "../services/user.service.js";
import { sendMail } from "../utils/sendMail.js";
import {
  addExpiryHours,
  generateRandomAvatar,
  generateRandomToken,
} from "../utils/util.js";

export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existinguser = await UserModel.findOne({ email });
    if (existinguser) {
      throw new BadRequestError("Email already in use");
    }
    const emailVerificationToken = await generateRandomToken();
    const profilePicture = generateRandomAvatar();
    const emailVerificationExpires = addExpiryHours();
    const newUser = new UserModel({
      firstName,
      lastName,
      email,
      password,
      profilePicture,
      emailVerificationToken,
      emailVerificationExpires,
    });

    await newUser.save();

    const mailOptions = {
      from: "admin@blog.com",
      to: newUser.email,
      subject: "Email Verification",
      template: "verifyEmail",
      context: {
        fullName: newUser.fullName,
        url: `${process.env.CLIENT_URL}/verify-email/${newUser.emailVerificationToken}`,
      },
    };

    await sendMail(mailOptions);

    return res.status(201).json({
      message: "User registered sucessfully",
      user: newUser,
    });
  } catch (error) {
    console.log(error);
  }
};
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await UserModel.findOneAndUpdate(
      { emailVerificationToken: token },
      {
        $set: {
          emailVerified: true,
          emailVerificationToken: "",
          emailVerificationExpires: null,
        },
      },
      { new: true }
    );
    if (!user) {
      throw new BadRequestError("Invalid or expired verification token");
    }
    return res.status(200).json({
      message: "Email verified successfully",
    });
  } catch (error) {
    console.log(error);
    throw new BadRequestError(error.message);
  }
};
export const resendEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });
    if (user.emailVerified) {
      throw new BadRequestError("Email is already verified");
    }
    const emailVerificationToken = await generateRandomToken();
    const emailVerificationExpires = addExpiryHours();
    user.emailVerificationToken = emailVerificationToken;
    user.emailVerificationExpires = emailVerificationExpires;

    await user.save();

    const mailOptions = {
      from: "admin@blog.com",
      to: user.email,
      subject: "Email Verification",
      template: "verifyEmail",
      context: {
        fullName: user.fullName,
        url: `${process.env.CLIENT_URL}/verify-email/${emailVerificationToken}`,
      },
    };

    await sendMail(mailOptions);
    return res.status(200).json({
      message: "Verification email resent successfully",
    });
  } catch (error) {
    console.log(error);
    throw new BadRequestError(error.message);
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new BadRequestError("User not found with given email");
    }
    const passwordResetToken = await generateRandomToken();
    const passwordResetExpires = addExpiryHours();

    user.passwordResetToken = passwordResetToken;
    user.passwordResetExpires = passwordResetExpires;
    await user.save();
    const mailOptions = {
      from: "admin@blog.com",
      to: user.email,
      subject: "reset your password",
      template: "resetPasswords",
      context: {
        fullName: user.fullName,
        url: `${process.env.CLIENT_URL}/reset-password/${passwordResetToken}`,
      },
    };
    await sendMail(mailOptions);

    return res.status(200).json({
      message: "password reset successful",
    });
  } catch (error) {
    console.log(error);
    throw new BadRequestError(error.message);
  }
};

export const resetPasswords = async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      throw new BadRequestError("password not found");
    }
    const token = req.params.token;
    const user = await findUser({ passwordResetToken: token });
    user.password = password;
    user.passwordResetToken = "";
    user.passwordResetExpires = null;
    await user.save();

    return res.status(200).json({
      message: "password reset successful",
    });
  } catch (error) {
    console.log(error);
    throw new BadRequestError(error.message);
  }
};
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findUser({ email });

    if (!user) {
      throw new NotFoundError("invalid credentials");
    }

    const matchedPAssword = await user.comparePassword(password);
    if (!matchedPAssword) {
      throw new NotFoundError("invalid password credentials");
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      user,
      accessToken,
    });
  } catch (error) {
    console.log(error);
    throw new BadRequestError(error.message);
  }
};
