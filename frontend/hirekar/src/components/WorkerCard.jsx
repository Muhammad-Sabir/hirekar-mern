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
      const response = await fetch("http://localhost:8000/api/chat/access-chat/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: id }),
      });

      if (!response.ok) {
        throw new Error("Failed to access chat");
      }

      const chatData = await response.json();
      console.log(chatData);
      navigate(`/employer/chats/${chatData._id}/${chatData.users[1].name}`)
      
    } catch (error) {
      console.error("Error accessing chat:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="m-4 overflow-hidden bg-white rounded shadow-xl w-60 h-[16rem]">
      <Link to={`/employer/${userId}`}>
        <div className="mb-2 text-lg font-bold">{name}</div>
        <p className="text-sm text-gray-700">
          <strong>Designation:</strong> {designation}
        </p>
        <p className="text-sm text-gray-700">
          <strong>Skills:</strong> {skills}
        </p>
        <p className="text-sm text-gray-700">
          <strong>Hourly Rate:</strong> Rs: {hourlyRate}
        </p>
        <p className="text-sm text-gray-700">
          <strong>Phone No:</strong> {phoneNo}
        </p>
        <p className="text-sm text-gray-700">
          <strong>Rating:</strong> {rating}
        </p>
      </Link>
      <div className="mt-4">
        <Link
          to={`/employer/hire/${name}/${userId}`}
          className="w-100% block text-center px-4 py-2 mb-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
        >
          Hire
        </Link>
        <button
          onClick={handleChatClick}
          className="w-full block text-center px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700"
          disabled={loading}
        >
          {loading ? "Loading..." : "Chat"}
        </button>
      </div>
    </div>
  );
}

export default WorkerCard;
