import Review from "../models/reviewModel.js";
import Worker from "../models/workerModel.js";

export const addReview = async (req, res) => {
  try {
    const { worker_id, job_id, rating, review } = req.body;
    const employer_id = req.user._id;

    const newReview = new Review({
      employer_id,
      worker_id,
      job_id,
      rating,
      review,
    });
    await newReview.save();

    const worker = await Worker.findByIdAndUpdate(
      worker_id,
      { $push: { reviews: newReview } },
      { new: true }
    );

    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export const getReviews = async (req, res) => {
  try {
    const { worker_id } = req.params;

    const reviews = await Review.find({ worker_id }).populate(
      "employer_id",
      "name email"
    );

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};
