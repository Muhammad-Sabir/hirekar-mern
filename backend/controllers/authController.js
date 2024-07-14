import User from "../models/userModel.js";
import Worker from "../models/workerModel.js";
import OTP from "../models/otpModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createAndSendOTP } from "../utils/otpUtils.js";

export const signup = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      address,
      phone_number,
      designation,
      location,
      skills,
      hourly_rate,
    } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // If the role is worker, validate worker-specific fields
    if (role === "worker") {
      if (!designation || !location || !skills || !hourly_rate) {
        return res.status(400).json({ message: "All worker fields must be provided" });
      }
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the user with common fields
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      address,
      phone_number,
    });

    await user.save();

    // If the role is worker, create a Worker entry
    if (role === "worker") {
      const worker = new Worker({
        user: user._id,
        designation,
        location,
        skills,
        hourly_rate,
      });

      await worker.save();
    }

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "User not verified" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.status(200).json({ token, user: { id: user._id, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export const verifyUserOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const otpEntry = await OTP.findOne({ email, otp });
    if (!otpEntry) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (otpEntry.expires_at < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const user = await User.findOneAndUpdate(
      { email },
      { isVerified: true },
      { new: true }
    );

    res.status(200).json({ message: "User verified", user });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    await createAndSendOTP(email);

    res.status(200).json({ message: "OTP sent to email." });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};
