/* eslint-disable react/prop-types */

function WorkerCard({
  name,
  designation,
  skill,
  experience,
  pricePerHour,
  location,
}) {
  return (
    <div className="flex flex-col justify-between p-6 m-4 overflow-hidden bg-white rounded shadow-lg w-80 h-[22rem]">
      <div>
        <div className="mb-2 text-xl font-bold">{name}</div>
        <p className="text-base text-gray-700">
          <strong>Designation:</strong> {designation}
        </p>
        <p className="text-base text-gray-700">
          <strong>Skill:</strong> {skill}
        </p>
        <p className="text-base text-gray-700">
          <strong>Experience:</strong> {experience} years
        </p>
        <p className="text-base text-gray-700">
          <strong>Location:</strong> {location}
        </p>
        <p className="text-base text-gray-700">
          <strong>Price per hour:</strong> ${pricePerHour}
        </p>
      </div>
      <div className="mt-4">
        <button className="w-full px-4 py-2 mb-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700">
          Hire
        </button>
        <button className="w-full px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700">
          Chat
        </button>
      </div>
    </div>
  );
}

export default WorkerCard;
