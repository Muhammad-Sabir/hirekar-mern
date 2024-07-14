import mongoose from "mongoose";

const { Schema } = mongoose;

const otpSchema = new Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  expires_at: { type: Date, required: true },
  verified: { type: Boolean, default: false },
});

const OTP = mongoose.model("OTP", otpSchema);
export default OTP;
