import mongoose from "mongoose";

const { Schema } = mongoose;

const reviewSchema = new Schema({
  employer_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  worker_id: { type: Schema.Types.ObjectId, ref: "Worker", required: true },
  job_id: { type: Schema.Types.ObjectId, ref: "Job", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

reviewSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

const Review = mongoose.model("Review", reviewSchema);
export default Review;
