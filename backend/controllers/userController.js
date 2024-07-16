import User from "../models/userModel.js";
import Worker from "../models/workerModel.js";

export const getProfile = async (req, res) => {
  try {
    const user_id = req.user._id;

    const user = await User.findById(user_id);
    let profile = { user };

    if (user.role === "worker") {
      const worker = await Worker.findOne({ user: user_id });
      profile = { ...profile, worker };
    }

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user_id = req.user._id;
    const {
      name,
      address,
      phone_number,
      designation,
      location,
      skills,
      hourly_rate,
    } = req.body;

    const user = await User.findByIdAndUpdate(
      user_id,
      { name, address, phone_number },
      { new: true }
    );

    if (user.role === "worker") {
      const worker = await Worker.findOneAndUpdate(
        { user: user_id },
        { designation, location, skills, hourly_rate },
        { new: true }
      );
      res.status(200).json({ user, worker });
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};
