import Chat from "../models/chatModel.js";
import Message from "../models/messageModel.js";

export const sendMessage = async (req, res) => {
  const { receiver_id, content } = req.body;

  try {
    const chat = await Chat.findOne({
      users: { $all: [req.user._id, receiver_id] },
    });

    let chatId;
    if (chat) {
      chatId = chat._id;
      chat.latest_message_id = newMessage._id;
      chat.updatedAt = Date.now();
      await chat.save();
    } else {
      const newChat = new Chat({
        users: [req.user._id, receiver_id],
        latest_message_id: newMessage._id,
      });
      await newChat.save();
      chatId = newChat._id;
    }

    const newMessage = new Message({
      sender_id: req.user._id,
      content,
      chat_id: chatId,
    });
    await newMessage.save();

    res.status(201).send(newMessage);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getMessages = async (req, res) => {
  const { chat_id } = req.params;

  try {
    const messages = await Message.find({ chat_id });
    res.send(messages);
  } catch (error) {
    res.status(500).send(error);
  }
};
