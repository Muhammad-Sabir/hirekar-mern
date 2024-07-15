import Job from "../models/jobModel.js";
import Worker from "../models/workerModel.js";
import User from "../models/userModel.js";
import {
  getAddressCordinates,
  calculateDistance,
} from "../utils/locationServices.js";

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
    const userId = req.user._id;

    const worker = await Worker.findOne({ user: userId }).populate("user");

    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    const pastJobs = await Job.find({
      worker_id: worker._id,
      status: { $in: ["completed", "pending"] },
    });
    if (pastJobs.length === 0) {
      return res.status(404).json({ message: "No past jobs found" });
    }

    let totalDistance = 0;
    let totalPrice = 0;
    pastJobs.forEach((job) => {
      totalDistance += calculateDistance(
        worker.location.coordinates,
        job.location.coordinates
      );
      totalPrice += job.price_per_hour;
    });
    const avgDistance = totalDistance / pastJobs.length;
    const avgPrice = totalPrice / pastJobs.length;

    const maxDistance = avgDistance * 1.2;
    const minPrice = avgPrice * 0.8;
    const maxPrice = avgPrice * 1.2;

    const recommendedJobs = await Job.find({
      status: "unassigned",
      title: worker.designation,
      "location.coordinates": {
        $geoWithin: {
          $centerSphere: [worker.location.coordinates, maxDistance / 3963.2],
        },
      },
      price_per_hour: { $gte: minPrice, $lte: maxPrice },
    });

    res.status(200).json(recommendedJobs);
  } catch (error) {
    console.error("Error fetching recommended jobs:", error.message);
    res.status(500).json({
      message: "Error fetching recommended jobs",
      error: error.message,
    });
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

export const getNearbyJobs = async (req, res) => {
  const { user_id } = req.params;

  try {
    // find the worker by ID
    const worker = await User.findById(user_id);
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    const workerAddress = worker.address;
    const { longitude, latitude } = await getAddressCordinates(workerAddress);

    // define the search radius
    const radius = 30 * 1000;

    //find nearby jobs based on worker's location
    const jobs = await Job.find({
      location: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          $maxDistance: radius,
        },
      },
      worker_id: null,
    }).populate({
      path: "employer_id",
      select: "name email",
    });

    const responseObject = {
      worker_coordinates: [longitude, latitude],
      jobs,
    };

    res.json(responseObject);
  } catch (error) {
    console.error("Error finding locations", error);
    res.status(500).json({ message: "Failed to find nearby jobs" });
  }
};
