import mongoose from "mongoose";

const { Schema } = mongoose;

// Chat Schema
const chatSchema = new Schema({
  users: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  latest_message_id: { type: Schema.Types.ObjectId, ref: "Message" },
  seen: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
