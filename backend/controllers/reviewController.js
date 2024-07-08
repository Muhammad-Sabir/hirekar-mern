import Review from "../models/reviewModel.js";
import Worker from "../models/workerModel.js";

export const addReview = async (req, res) => {
  const { worker_id, rating, review } = req.body;

  try {
    const newReview = new Review({
      employer_id: req.user._id,
      worker_id,
      rating,
      review,
    });
    await newReview.save();

    const reviews = await Review.find({ worker_id });

    const totalRatings = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    const averageRating = totalRatings / reviews.length;

    await Worker.findByIdAndUpdate(worker_id, { ratings: averageRating });

    res.status(201).send(newReview);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getReviews = async (req, res) => {
  const { worker_id } = req.params;

  try {
    const reviews = await Review.find({ worker_id });
    res.send(reviews);
  } catch (error) {
    res.status(500).send(error);
  }
};
