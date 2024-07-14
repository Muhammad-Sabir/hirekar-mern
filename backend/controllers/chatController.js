import Chat from "../models/chatModel.js";
import Message from "../models/messageModel.js";

export const getAllChats = async (req, res) => {
  try {
    const { userId } = req.params;

    const chats = await Chat.find({ users: userId }).populate(
      "users",
      "name email"
    );

    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { sender_id, content, chat_id } = req.body;

    const message = new Message({ sender_id, content, chat_id });
    await message.save();

    await Chat.findByIdAndUpdate(chat_id, {
      latest_message_id: message._id,
      seen: false,
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export const getAllMessages = async (req, res) => {
  try {
    const { chat_id } = req.params;

    const messages = await Message.find({ chat_id }).populate(
      "sender_id",
      "name email"
    );

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};
