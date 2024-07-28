/* eslint-disable react/prop-types */

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function WorkerCard({
  id,
  userId,
  name,
  designation,
  skills,
  hourlyRate,
  rating,
  phoneNo,
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleChatClick = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:8000/api/chat/access-chat/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: id }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to access chat");
      }

      const chatData = await response.json();
      console.log("Chat Data", chatData);
      navigate(`/employer/chats/${chatData._id}/${chatData.users[1].name}`);
    } catch (error) {
      console.error("Error accessing chat:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-between w-64 m-4 overflow-hidden rounded-lg shadow-lg bg-slate-200 h-80">
      <Link to={`/employer/${userId}`} className="block p-4">
        <div className="mb-2 text-xl font-bold text-gray-800">{name}</div>
        <p className="mb-1 text-sm text-gray-600">
          <strong>Designation:</strong> {designation}
        </p>
        <p className="mb-1 text-sm text-gray-600">
          <strong>Skills:</strong> {skills}
        </p>
        <p className="mb-1 text-sm text-gray-600">
          <strong>Hourly Rate:</strong> Rs: {hourlyRate}
        </p>
        <p className="mb-1 text-sm text-gray-600">
          <strong>Phone No:</strong> {phoneNo}
        </p>
        <p className="mb-4 text-sm text-gray-600">
          <strong>Rating:</strong> {rating}
        </p>
      </Link>
      <div className="px-4 pb-4">
        <Link
          to={`/employer/hire/${name}/${userId}`}
          className="block w-full px-4 py-2 mb-2 font-bold text-center text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Hire
        </Link>
        <button
          onClick={handleChatClick}
          className="block w-full px-4 py-2 font-bold text-center text-white bg-green-500 rounded hover:bg-green-600"
          disabled={loading}
        >
          {loading ? "Loading..." : "Chat"}
        </button>
      </div>
    </div>
  );
}

export default WorkerCard;
