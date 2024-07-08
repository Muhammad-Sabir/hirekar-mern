import mongoose from "mongoose";

const { Schema } = mongoose;

// Worker Schema
const workerSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  designation: String,
  phone_number: String,
  date_of_birth: Date,
  city: String,
  address: String,
  current_designation: String,
  current_company: String,
  years_of_experience: Number,
  hourly_rate: Number,
  skills: [String],
  ratings: Number,
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

workerSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

const Worker = mongoose.model("Worker", workerSchema);
export default Worker;
