import Worker from "../models/workerModel.js";
import User from "../models/userModel.js";
import Job from "../models/jobModel.js";
import {
  calculateDistance,
  calculateAverageLocation,
} from "../utils/locationServices.js";

export const getAllWorkers = async (req, res) => {
  try {
    const workers = await Worker.find()
      .populate({
        path: "user",
        select: "name email phone_number",
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
      return res.status(404).json({ message: "Employer not found" });
    }

    const longitude = employer.location.coordinates[0];
    const latitude = employer.location.coordinates[1];

    //find nearby workers based on computed location
    const radius = 30;
    const workers = await User.find({
      location: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          $maxDistance: radius * 1000,
        },
      },
      role: "worker",
    });

    const responseObject = {
      emp_coordinates: [longitude, latitude],
      workers,
    };

    res.json(responseObject);
  } catch (error) {
    console.error("Error finding locations", error);
    res.status(500).json({ message: "Failed to find nearby workers" });
  }
};

export const getRecommendedWorkers = async (req, res) => {
  const employerId = req.user._id;

  try {
    const jobs = await Job.find({ employer_id: employerId }).populate(
      "worker_id"
    );

    if (!jobs.length) {
      return res.status(200).json([]);
    }

    // Count the number of jobs per worker designation
    const designationCount = {};
    jobs.forEach((job) => {
      if (job.worker_id && job.worker_id.designation) {
        const designation = job.worker_id.designation;
        designationCount[designation] =
          (designationCount[designation] || 0) + 1;
      }
    });

    if (Object.keys(designationCount).length === 0) {
      return res.status(200).json( []);
    }

    // Find the most frequent designation
    const mostFrequentDesignation = Object.keys(designationCount).reduce(
      (a, b) => (designationCount[a] > designationCount[b] ? a : b)
    );

    console.log("Job found", mostFrequentDesignation);

    // Get the locations and prices for jobs with the most frequent designation
    const frequentDesignationJobs = jobs.filter(
      (job) =>
        job.worker_id && job.worker_id.designation === mostFrequentDesignation
    );

    const locations = frequentDesignationJobs.map(
      (job) => job.location.coordinates
    );
    const prices = frequentDesignationJobs.map((job) => job.price_per_hour);

    // Calculate the average coordinates and price
    const averageCoordinates = calculateAverageLocation(
      locations.map(([lat, lon]) => ({ lat, lon }))
    );

    const averagePrice = prices.reduce((a, b) => a + b, 0) / prices.length;

    // Define the distance and price range
    const distanceRange =
      1.2 * calculateDistance(averageCoordinates, averageCoordinates); // +20% distance

    const priceRange = [averagePrice * 0.8, averagePrice * 1.2]; // +-20% price

    // Find workers based on the criteria
    const recommendedWorkers = await Worker.find({
      designation: mostFrequentDesignation,
      "location.coordinates": {
        $geoWithin: {
          $centerSphere: [
            [averageCoordinates.longitude, averageCoordinates.latitude],
            distanceRange / 6378.1,
          ], // 6378.1 km is the radius of the Earth
        },
      },
      hourly_rate: { $gte: priceRange[0], $lte: priceRange[1] },
    })
      .populate({
        path: "user",
        select: "name email phone_number",
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

    return res.status(200).json(recommendedWorkers);
  } catch (error) {
    console.error("Error fetching recommended workers:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const searchWorkers = async (req, res) => {
  try {
    const { name, designation, hourlyRate, minRating } = req.query;

    let filteredWorkers = [];

    if (name) {
      const workersWithName = await Worker.find().populate({
        path: "user",
        match: { name: { $regex: new RegExp(name, "i") } }, // Case-insensitive search for name
        select: "_id name",
      });

      filteredWorkers = workersWithName.filter(
        (worker) => worker.user !== null
      );
    }

    if (designation) {
      filteredWorkers = filteredWorkers.filter(
        (worker) => worker.designation === designation
      );
    }

    if (hourlyRate) {
      filteredWorkers = filteredWorkers.filter(
        (worker) => worker.hourly_rate === parseInt(hourlyRate)
      );
    }

    if (minRating) {
      const workersWithReviews = await Worker.find(query).populate({
        path: "reviews",
        match: { rating: { $gte: parseInt(minRating) } },
        select: "_id",
      });

      const workerIds = workersWithReviews.map((worker) => worker._id);
      const workers = await Worker.find({ _id: { $in: workerIds } });
      return res.status(200).json(workers);
    }

    if (filteredWorkers.length === 0) {
      return res
        .status(404)
        .json({ message: "No workers found matching the criteria." });
    }

    return res.status(200).json(filteredWorkers);
  } catch (error) {
    console.error("No worker found:", error.message);
    res.status(500).json({
      message: "No worker found",
      error: error.message,
    });
  }
};

export const workerDetails = async (req, res) => {
  try {
    const { worker_id } = req.params;

    const worker = await Worker.findById(worker_id)
      .populate({
        path: "user",
        select: "name email address phone_number",
      })
      .populate({
        path: "reviews",
        populate: {
          path: "employer_id",
          model: User,
          select: "name email  ",
        },
        select: "_id employer_id worker_id job_id rating review",
      });

    res.status(200).json(worker);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};
