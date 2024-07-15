import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ["employer", "worker"] },
  address: { type: String },
  location: { type: { type: String }, coordinates: [Number] },
  phone_number: { type: String },
  isVerified: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

userSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

userSchema.index({ location: "2dsphere" });

const User = mongoose.model("User", userSchema);
export default User;
