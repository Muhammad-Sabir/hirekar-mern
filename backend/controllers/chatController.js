import Chat from "../models/chatModel.js";
import Message from "../models/messageModel.js";
import User from "../models/userModel.js";

export const getAllChats = async (req, res) => {
  try {
    const userId = req.user._id;

    const chats = await Chat.find({ users: userId }).populate(
      "users",
      "name email role "
    ).populate("latest_message_id");

    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export const accessChat = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User Id not sent." });
    }

    let isChat = await Chat.findOne({
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password -role -isVerified -phone_number -address")
      .populate("latest_message_id");

    if (isChat) {
      isChat = await User.populate(isChat, {
        path: "latest_message_id.sender_id",
        select: "name email",
      });

      return res.status(200).json(isChat);
    }

    const chatData = {
      users: [req.user._id, userId],
    };

    const createdChat = await Chat.create(chatData);
    const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
      "users",
      "-password -role -isVerified -phone_number -address"
    );

    return res.status(200).json(fullChat);
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong.", error });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { content, chat_id } = req.body;

    if (!content || !chat_id) {
      res.status(400).json({ message: "Content or chatId not provided." });
    }

    const newMessage = {
      sender_id: req.user._id,
      content: content,
      chat_id: chat_id,
    };

    try {
      let message = await Message.create(newMessage);

      message = await Message.populate(message, "sender_id chat_id");

      message.chat_id = await Chat.populate(message.chat_id, "users");

      await Chat.findByIdAndUpdate(chat_id, {
        latest_message_id: message,
      });

      res.status(200).json(message);
    } catch (error) {
      res.status(400).json(error.message);
    }
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
