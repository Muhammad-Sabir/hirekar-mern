import crypto from "crypto";
import nodemailer from "nodemailer";
import OTP from "../models/otpModel.js";

const generateOTP = () => {
  return crypto.randomBytes(3).toString("hex");
};

const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "ark.abdul2002@gmail.com",
      pass: "fvmnakucofdgxwap",
    },
  });

  const mailOptions = {
    from: "ark.abdul2002@gmail.com",
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};

export const createAndSendOTP = async (email) => {
  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

  const newOtp = new OTP({ email, otp, expires_at: expiresAt });
  await newOtp.save();
  await sendOTPEmail(email, otp);
};
