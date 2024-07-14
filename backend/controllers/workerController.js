import Worker from "../models/workerModel.js";
import User from "../models/userModel.js";
import { getAddressCordinates } from "../utils/locationServices.js";

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

export const getNearbyWorkers = async (req, res) => {
  const { user_id } = req.params;

  try {
    //fetch employer's address based on employerId
    const employer = await User.findById(user_id);
    if (!employer) {
      return res.status(404).json({ message: 'Employer not found' });
    }

    const employerAddress = employer.address;

    // call external API to fetch location details
    const { longitude, latitude }  = await getAddressCordinates(employerAddress);

    //find nearby workers based on computed location
    const radius = 10;
    const workers = await Worker.find({
      location: {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: radius * 1000,
        },
      },
    }).populate({
      path: "user",
      select: "name email",
    });

    const responseObject = {
      emp_coordinates: [longitude, latitude],
      workers,
    };

    res.json(responseObject);
  } catch (error) {
    console.error('Error finding locations', error);
    res.status(500).json({ message: 'Failed to find nearby workers' });
  }
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
