import Job from "../models/jobModel.js";
import Worker from "../models/workerModel.js";
import User from "../models/userModel.js";
import {
  getAddressCordinates,
  calculateDistance,
} from "../utils/locationServices.js";

export const createJob = async (req, res) => {
  try {
    const { title, description, price_per_hour, hours, address } = req.body;

    const employer_id = req.user._id;

    const user = await User.findById(employer_id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "employer") {
      return res
        .status(403)
        .json({ message: "Only employers can create jobs" });
    }

    let longitude,
      latitude = 0;
    try {
      ({ longitude, latitude } = await getAddressCordinates(address));
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }

    const job = new Job({
      employer_id,
      title,
      description,
      status: "unassigned",
      price_per_hour,
      hours,
      location: { type: "Point", coordinates: [longitude, latitude] },
    });
    await job.save();

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
    console.log(error.message);
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
      .populate({
        path: "worker_id",
        select: "user",
        populate: {
          path: "user",
          select: "name",
        },
      });

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

    const userLocation = worker.user.location.coordinates;

    const pastJobs = await Job.find({
      worker_id: worker._id,
      status: { $in: ["completed", "pending"] },
    });

    if (pastJobs.length === 0) {
      return res.status(200).json([]);
    }

    let totalDistance = 0;
    let totalPrice = 0;
    pastJobs.forEach((job) => {
      console.log("Working", userLocation);
      console.log("Working2", job.location.coordinates);
      totalDistance += calculateDistance(
        userLocation,
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
          $centerSphere: [userLocation, maxDistance / 3963.2],
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
    const user_id = req.user._id;
    const role = req.user.role;

    let jobs;
    if (role === "worker") {
      const worker = await Worker.findOne({ user: user_id });
      if (!worker) {
          return res.status(404).json({ message: "Worker not found" });
      }

      const worker_id = worker._id;
      jobs = await Job.find({ worker_id })
        .populate("employer_id", "name email")
        .sort({ createdAt: -1 });
      

    } else if (role === "employer") {
      jobs = await Job.find({ employer_id: user_id })
        .populate({
          path: "worker_id",
          populate: {
            path: "user",
            model: User,
          },
        })
        .sort({ createdAt: -1 });
    }

    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export const getNearbyJobs = async (req, res) => {
  const user_id = req.user._id;

  try {
    // find the worker by ID
    const worker = await User.findById(user_id);
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    const longitude = worker.location.coordinates[0];
    const latitude = worker.location.coordinates[1];

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
