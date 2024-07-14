import mongoose from "mongoose";

const { Schema } = mongoose;

const jobSchema = new Schema({
  employer_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  worker_id: { type: Schema.Types.ObjectId, ref: "Worker" },
  title: { type: String, required: true },
  description: String,
  status: {
    type: String,
    required: true,
    enum: ["requested", "negotiating", "pending", "completed", "unassigned"],
  },
  price_per_hour: Number,
  hours: Number,
  location: { type: { type: String }, coordinates: [Number] },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

jobSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

jobSchema.index({ location: "2dsphere" });

const Job = mongoose.model("Job", jobSchema);
export default Job;
