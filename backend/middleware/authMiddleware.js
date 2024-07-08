import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");

  if (!token) {
    return res.status(401).send({ error: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    User.findOne({ _id: decoded._id })
      .then((user) => {
        if (!user) {
          throw new Error("Invalid token or user not found.");
        }
        req.token = token;
        req.user = user;
        next();
      })
      .catch((error) => {
        console.error(error);
        res.status(401).send({ error: "Invalid token or unauthorized." });
      });
  } catch (error) {
    console.error(error);
    res.status(401).send({ error: "Authentication error." });
  }
};

export default authMiddleware;
