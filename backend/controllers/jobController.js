import Job from "../models/jobModel.js";
import Worker from "../models/workerModel.js";
import User from "../models/userModel.js";

export const createJob = async (req, res) => {
  try {
    const { employer_id, title, description, price_per_hour, hours, location } =
      req.body;

    const user = await User.findById(employer_id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "employer") {
      return res
        .status(403)
        .json({ message: "Only employers can create jobs" });
    }

    const job = new Job({
      employer_id,
      title,
      description,
      status: "unassigned",
      price_per_hour,
      hours,
      location,
    });
    await job.save();

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export const assignJob = async (req, res) => {
  try {
    const { job_id, worker_id } = req.body;

    const job = await Job.findByIdAndUpdate(
      job_id,
      { worker_id, status: "requested" },
      { new: true }
    );
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export const updateJob = async (req, res) => {
  try {
    const { job_id, status, price_per_hour, hours } = req.body;
    let job;
    if (status === "unassigned") {
      job = await Job.findByIdAndUpdate(
        job_id,
        { status, worker_id: null },
        { new: true }
      );
    } else {
      job = await Job.findByIdAndUpdate(
        job_id,
        { status, price_per_hour, hours },
        { new: true }
      );
    }

    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("employer_id", "name email")
      .populate("worker_id", "name email");

    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export const getRecommendedJobs = async (req, res) => {
  try {
    const { user_id } = req.params;

    const worker = await Worker.findOne({ user: user_id });
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    const jobs = await Job.find({
      $or: [
        { designation: worker.designation },
        {
          location: {
            $nearSphere: { $geometry: worker.location, $maxDistance: 10000 },
          },
        },
        {
          price_per_hour: {
            $gte: worker.hourly_rate * 0.8,
            $lte: worker.hourly_rate * 1.2,
          },
        },
      ],
    });

    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export const getNearbyJobs = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { distance } = req.query;

    if (!distance || isNaN(distance)) {
      return res.status(400).json({ message: "Invalid distance parameter" });
    }

    const worker = await Worker.findOne({ user: user_id });
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    const jobs = await Job.find({
      location: {
        $nearSphere: {
          $geometry: worker.location,
          $maxDistance: distance * 1000,
        },
      },
      status: "requested",
    });

    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export const getJobHistory = async (req, res) => {
  try {
    const { user_id, role } = req.params;

    let jobs;
    if (role === "worker") {
      jobs = await Job.find({ worker_id: user_id }).populate(
        "employer_id",
        "name email"
      );
    } else if (role === "employer") {
      jobs = await Job.find({ employer_id: user_id }).populate(
        "worker_id",
        "name email"
      );
    }

    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};
