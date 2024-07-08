import Worker from "../models/workerModel.js";
import User from "../models/userModel.js";

export const listWorkers = async (req, res) => {
  try {
    const workers = await Worker.find().populate({
      path: "user",
      select: "name",
    });

    const formattedWorkers = workers.map((worker) => ({
      ...worker.toObject(),
      name: worker.user.name,
      user: undefined,
    }));

    res.status(200).json(formattedWorkers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const searchWorkers = async (req, res) => {
  const { name, skills, location, price } = req.query;

  try {
    const query = {};
    if (name) {
      query.$or = [
        { first_name: new RegExp(name, "i") },
        { last_name: new RegExp(name, "i") },
      ];
    }
    if (skills) {
      query.skills = { $in: skills.split(",") };
    }
    if (location) {
      query.city = location;
    }
    if (price) {
      query.hourly_rate = { $lte: Number(price) };
    }

    const workers = await Worker.find(query);
    res.send(workers);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const workerDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || user.role !== "worker") {
      return res.status(404).json({ message: "Worker not found" });
    }

    const worker = await Worker.findOne({ user: user._id }).populate("reviews");

    if (!worker) {
      return res.status(404).json({ message: "Worker details not found" });
    }

    res.status(200).json(worker);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateResume = async (req, res) => {
  try {
    const { name, ...workerData } = req.body;

    const user = await User.findById(req.params.id);

    if (!user || user.role !== "worker") {
      return res.status(404).json({ message: "Worker not found" });
    }

    user.name = name;
    await user.save();

    const worker = await Worker.findOneAndUpdate(
      { user: user._id },
      workerData,
      { new: true }
    );

    if (!worker) {
      return res.status(404).json({ message: "Worker details not found" });
    }

    res.status(200).json(worker);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
