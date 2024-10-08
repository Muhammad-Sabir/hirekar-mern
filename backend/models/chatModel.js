import mongoose from "mongoose";

const { Schema } = mongoose;

const chatSchema = new Schema({
  users: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  latest_message_id: { type: Schema.Types.ObjectId, ref: "Message" },
  blocked_by: { type: Schema.Types.ObjectId, ref: "User", default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
