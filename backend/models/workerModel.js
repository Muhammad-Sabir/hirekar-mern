import mongoose from "mongoose";

const { Schema } = mongoose;

const workerSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  designation: {
    type: String,
    enum: ["Driver", "Gardener", "Electrician", "Plumber"],
    required: true,
  },
  skills: { type: [String], required: true },
  hourly_rate: Number,
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
