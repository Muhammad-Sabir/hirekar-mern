import Worker from "../models/workerModel.js";
import User from "../models/userModel.js";

export const getAllWorkers = async (req, res) => {
  try {
    const workers = await Worker.find()
      .populate({
        path: "user",
        select: "name email",
      })
      .populate({
        path: "reviews",
        populate: {
          path: "employer_id",
          model: User,
          select: "name",
        },
        select: "_id employer_id worker_id job_id rating review",
      });

    res.status(200).json(workers);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export const getWorkers = async (req, res) => {
  // Implement geospatial query here
};

export const getRecommendedWorkers = async (req, res) => {
  // Implement recommendation logic here
};

export const searchWorkers = async (req, res) => {
  // Implement search logic here
};

export const workerDetails = async (req, res) => {
  try {
    const { worker_id } = req.params;

    const worker = await Worker.findById(worker_id)
      .populate({
        path: "user",
        select: "name email",
      })
      .populate({
        path: "reviews",
        populate: {
          path: "employer_id",
          model: User,
          select: "name",
        },
        select: "_id employer_id worker_id job_id rating review",
      });

    res.status(200).json(worker);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};
