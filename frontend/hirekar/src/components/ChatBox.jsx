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
  const [blockedBy, setBlockedBy] = useState(null);
  const [showBlockConfirmation, setShowBlockConfirmation] = useState(false);
  const [showUnblockConfirmation, setShowUnblockConfirmation] = useState(false);
  const { chat_id } = useParams();
  const { chat_user } = useParams();
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

  useEffect(() => {
    const fetchChatDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/chat/${chat_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch chat details");
        }

        const chat = await response.json();
        console.log("chat.blocked_by");
        console.log(chat.blocked_by);
        setBlockedBy(chat.blocked_by);
      } catch (error) {
        console.error("Error fetching chat details:", error);
      }
    };

    fetchChatDetails();
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

  const handleBlock = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/chat/block/${chat_id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to block user");
      }

      const chat = await response.json();
      setBlockedBy(chat.blocked_by);
      console.log("chat.blocked_by2");
      console.log(chat);
      setShowBlockConfirmation(false);
    } catch (error) {
      console.error("Error blocking user:", error);
    }
  };

  const handleUnblock = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/chat/unblock/${chat_id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to unblock user");
      }

      const chat = await response.json();
      setBlockedBy(chat.blocked_by);
      setShowUnblockConfirmation(false);
    } catch (error) {
      console.error("Error unblocking user:", error);
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
          <span className="text-lg font-semibold text-gray-800">
            {chat_user}
          </span>
        </div>
        {blockedBy === null || blockedBy === undefined ? (
          <button
            className="px-4 py-2 text-white bg-red-600 rounded-lg"
            onClick={() => setShowBlockConfirmation(true)}
          >
            Block
          </button>
        ) : blockedBy === userData._id ? (
          <button
            className="px-4 py-2 text-white bg-green-600 rounded-lg"
            onClick={() => setShowUnblockConfirmation(true)}
          >
            Unblock
          </button>
        ) : (
          <button
            className="px-4 py-2 text-white bg-gray-600 rounded-lg"
            disabled
          >
            Blocked
          </button>
        )}
      </div>
      <div className="relative flex flex-col justify-between flex-1 h-full p-4 overflow-y-auto bg-gray-100">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`flex items-center mb-4 ${
              message.sender_id._id === userData._id
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`p-4 rounded-lg ${
                message.sender_id._id === userData._id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-800"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>
      {blockedBy === null ? (
        <form
          onSubmit={handleSubmit}
          className="flex p-4 mb-10 bg-white border-t"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Type a message..."
          />
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-600 rounded-r-lg"
          >
            Send
          </button>
        </form>
      ) : (
        <div className="p-4 text-center text-red-500">
          You cannot send messages in this chat.
        </div>
      )}
      {showBlockConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="mb-4 text-lg font-semibold">
              Are you sure you want to block this user?
            </h2>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 mr-2 text-white bg-red-600 rounded-lg"
                onClick={handleBlock}
              >
                Block
              </button>
              <button
                className="px-4 py-2 text-gray-800 bg-gray-300 rounded-lg"
                onClick={() => setShowBlockConfirmation(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {showUnblockConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="mb-4 text-lg font-semibold">
              Are you sure you want to unblock this user?
            </h2>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 mr-2 text-white bg-green-600 rounded-lg"
                onClick={handleUnblock}
              >
                Unblock
              </button>
              <button
                className="px-4 py-2 text-gray-800 bg-gray-300 rounded-lg"
                onClick={() => setShowUnblockConfirmation(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBox;
