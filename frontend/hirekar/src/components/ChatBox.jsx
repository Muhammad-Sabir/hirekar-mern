import { useState, useEffect, useRef } from "react";
import { FaUserCircle } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";

import io from "socket.io-client";

const ENDPOINT = "http://localhost:8000";
let selectedChatCompare;

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const { chat_id } = useParams();
  const {chat_user} = useParams();
  const token = localStorage.getItem("token");
  const selectedChat = localStorage.getItem("selectedChat");
  const currentUrl = window.location.href;
  const hasWorkerPath = currentUrl.includes("/worker");

  const userData = JSON.parse(localStorage.getItem("user"));
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io(ENDPOINT);
    socketRef.current.emit("setup", userData);
    socketRef.current.on("connect", () => setSocketConnected(true));

    socketRef.current.on("message received", (newMessageReceived) => {
      setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/chat/messages/${chat_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }

        const data = await response.json();
        console.log(data);
        setMessages(data);

        const otherUser =
          data.length > 0 && data[0].sender_id._id !== chat_id
            ? data[0].sender_id.name
            : "Unknown User";
        setUser(otherUser);

        socketRef.current.emit("join chat", chat_id);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    selectedChatCompare = selectedChat;
  }, [chat_id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/api/chat/message/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: newMessage,
          chat_id: chat_id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const sentMessage = await response.json();
      setMessages((prevMessages) => [...prevMessages, sentMessage]);
      setNewMessage("");

      socketRef.current.emit("new message", sentMessage);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between w-full p-4 bg-white border-b border-gray-200 shadow-md">
        <div className="flex items-center">
          <Link
            to={hasWorkerPath ? "/worker/chats" : "/employer/chats"}
            className="mr-4"
          >
            <MdKeyboardDoubleArrowLeft className="text-2xl text-blue-600" />
          </Link>
          <FaUserCircle className="mr-2 text-2xl text-gray-800" />
          <span className="text-lg font-semibold text-gray-800">{chat_user}</span>
        </div>
      </div>

      <div className="flex flex-col h-[80vh] bg-gray-100 p-4 pt-4 pb-0 pl-8 pr-8">
        <div className="flex-1 overflow-y-auto">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`flex ${
                msg.sender_id._id === chat_id ? "justify-end" : "justify-start"
              } mb-4`}
            >
              <div
                className={`max-w-xs mx-2 px-4 py-2 rounded-lg shadow-md ${
                  msg.sender_id._id === chat_id
                    ? "bg-blue-600 text-white self-end"
                    : "bg-white text-gray-800"
                }`}
              >
                <p>
                  {msg.sender_id._id === chat_id ? "You" : user}: {msg.content}
                </p>
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex items-center justify-between p-4 bg-white"
        >
          <input
            type="text"
            className="flex-1 px-4 py-2 mr-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none"
          >
            Send
          </button>
        </form>
      </div>
    </>
  );
};

export default ChatBox;
