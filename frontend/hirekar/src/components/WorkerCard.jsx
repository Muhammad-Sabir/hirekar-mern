/* eslint-disable react/prop-types */

import { Link } from "react-router-dom";

function WorkerCard({
  name,
  designation,
  skills,
  experience,
  pricePerHour,
  location,
}) {
  return (
    <div className="m-4 overflow-hidden bg-white rounded shadow-xl w-60 h-[16rem]">
      <div>
        <div className="mb-2 text-lg font-bold">{name}</div>
        <p className="text-sm text-gray-700">
          <strong>Designation:</strong> {designation}
        </p>
        <p className="text-sm text-gray-700">
          <strong>Skills:</strong> {skills}
        </p>
        <p className="text-sm text-gray-700">
          <strong>Experience:</strong> {experience} years
        </p>
        <p className="text-sm text-gray-700">
          <strong>Location:</strong> {location}
        </p>
        <p className="text-sm text-gray-700">
          <strong>Price per hour:</strong> Rs.{pricePerHour}
        </p>
      </div>
      <div className="mt-4">
        <Link to={'hire'} className="w-100% block text-center px-4 py-2 mb-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700">
          Hire
        </Link>
        <Link to={`chats/${name}`} className="w-100% block text-center px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700">
          Chat
        </Link>
      </div>
    </div>
  );
}

export default WorkerCard;