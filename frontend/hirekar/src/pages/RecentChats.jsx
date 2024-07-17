import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const RecentChats = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true); // Introduce loading state
  const currentUrl = window.location.href;
  const hasWorkerPath = currentUrl.includes("/worker");
  const token = localStorage.getItem("token");
  const currentUserRole = localStorage.getItem("role");

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/chat/chats/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch chats");
        }

        const data = await response.json();
        setChats(data);
        setLoading(false); // Update loading state after fetching
      } catch (error) {
        console.error("Error fetching chats:", error);
        setLoading(false); // Ensure loading state is updated even on error
      }
    };

    fetchChats();
  }, [token, currentUserRole]);

  const selectChat = (chat) => {
    localStorage.setItem("selectedChat", JSON.stringify(chat));
  };

  if (loading) {
    return <div>Loading...</div>; // Display a loading indicator while fetching
  }

  return (
    <div className="w-full p-4 pt-4 pb-8 pl-8 pr-8">
      <h2 className="mb-2 text-lg font-semibold">Your Recent Chats:</h2>
      <div className="space-y-4">
        {chats.map((chat, index) => {
          const isoDate = chat.updatedAt;
          const date = new Date(isoDate);
          const formattedDate = date.toLocaleDateString("en-US");
          const otherUser = chat.users.find(
            (user) => user.role !== (hasWorkerPath ? "worker" : "employer")
          );

          return (
            <Link
              onClick={() => selectChat(chat)}
              key={index}
              to={
                hasWorkerPath
                  ? `/worker/chats/${chat._id}/${chat.users[0].name}`
                  : `/employer/chats/${chat._id}/${chat.users[1].name}`
              }
              className="block p-4 transition duration-300 ease-in-out rounded-lg shadow-md hover:shadow-lg hover:bg-gray-100"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <strong className="font-normal text-blue-600 text-md">
                    {otherUser.name}
                  </strong>
                  <span className="text-sm text-gray-500">{formattedDate}</span>
                </div>
                <p className="text-sm text-gray-800">
                  {chat.latest_message_id ? chat.latest_message_id.content : "No recent message"}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default RecentChats;
