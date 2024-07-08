import Job from "../models/jobModel.js";
import Worker from "../models/workerModel.js";

export const hireWorker = async (req, res) => {
  const { worker_id, title, description, price_per_hour, hours } = req.body;

  try {
    const job = new Job({
      employer_id: req.user._id,
      worker_id,
      title,
      description,
      status: "requested",
      price_per_hour,
      hours,
      total_price: price_per_hour * hours,
    });
    await job.save();

    res.status(201).send(job);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const jobHistory = async (req, res) => {
  try {
    const worker = await Worker.findOne({ user: req.user._id });
    const jobs = await Job.find({ worker_id: worker._id });

    res.send(jobs);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const updateJobStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).send();
    }

    job.status = status;
    await job.save();

    res.send(job);
  } catch (error) {
    res.status(400).send(error);
  }
};
