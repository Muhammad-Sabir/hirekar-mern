import mongoose from "mongoose";

const { Schema } = mongoose;

// Job Schema
const jobSchema = new Schema({
  employer_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  worker_id: { type: Schema.Types.ObjectId, ref: "Worker" },
  title: { type: String, required: true },
  description: String,
  status: {
    type: String,
    required: true,
    enum: ["requested", "pending", "completed", "rejected"],
  },
  price_per_hour: Number,
  hours: Number,
  total_price: Number,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

jobSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

const Job = mongoose.model("Job", jobSchema);
export default Job;
