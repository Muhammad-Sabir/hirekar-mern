/* eslint-disable react/prop-types */

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import gardener from "/assets/gardener.jpg";
import plumber from "/assets/plumber.jpg";
import driver from "/assets/driver.jpg";
import electrician from "/assets/electrician.jpg";

function JobCard({ job, handleFilteredJobs }) {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [rate, setRate] = useState("");
  const [hours, setHours] = useState("");
  const [worker, setWorker] = useState(null);

  let picture;

  if (job.title.toLowerCase() === "gardener") picture = gardener;
  else if (job.title.toLowerCase() === "plumber") picture = plumber;
  else if (job.title.toLowerCase() === "driver") picture = driver;
  else if (job.title.toLowerCase() === "electrician") picture = electrician;

  useEffect(() => {
    const fetchAllWorkers = async () => {
      const response = await fetch(
        "http://hirekar-frontend.s3-website.eu-north-1.amazonaws.com/api/worker/all",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    };

    const findWorker = async () => {
      try {
        const workers = await fetchAllWorkers();
        const worker = workers.find((w) => w.user._id === currentUser._id);
        console.log("Worker:", worker);
        setWorker(worker);
      } catch (error) {
        console.error("Error fetching worker:", error);
      }
    };

    findWorker();
  }, [currentUser._id]);

  const handleChatClick = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://hirekar-frontend.s3-website.eu-north-1.amazonaws.com/api/chat/access-chat/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: job.employer_id._id }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to access chat");
      }

      const chatData = await response.json();
      console.log("Chat Data", chatData);
      navigate(`/worker/chats/${chatData._id}/${chatData.users[0].name}`);
    } catch (error) {
      console.error("Error accessing chat:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNegotiate = async () => {
    if (!worker) {
      alert("Worker not found");
      return;
    }

    try {
      // First API call to assign the job
      const response = await fetch(
        "http://hirekar-frontend.s3-website.eu-north-1.amazonaws.com/api/job/assign",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            job_id: job._id,
            worker_id: worker._id,
          }),
        }
      );

      if (response.ok) {
        const newJob = {
          ...job,
          status: "negotiating",
          price_per_hour: rate,
          hours: hours,
        };
        handleFilteredJobs(newJob);

        // Second API call to update the job status and details
        const response2 = await fetch(
          "http://hirekar-frontend.s3-website.eu-north-1.amazonaws.com/api/job/update",
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              job_id: job._id, // Assuming job_id is needed here as well
              status: "negotiating",
              price_per_hour: rate,
              hours: hours,
            }),
          }
        );

        if (response2.ok) {
          setShowOfferModal(false);
          alert("Negotiating now!");
        } else {
          const errorData = await response2.json();
          throw new Error(errorData.message);
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    } catch (error) {
      console.error("Error negotiating job:", error);
    }
  };

  return (
    <div className="flex flex-col justify-between w-64 p-4 m-4 overflow-hidden rounded-lg shadow-lg bg-slate-200">
      <div className="flex justify-center">
        <img
          src={picture}
          alt="image"
          className="object-cover w-full h-40 rounded"
        />
      </div>
      <div className="flex flex-col justify-between h-full">
        <div>
          <p className="mb-1 text-sm text-gray-700">
            <strong>Title:</strong> {job.title}
          </p>
          <p className="mb-1 text-sm text-gray-700">
            <strong>Description:</strong> {job.description}
          </p>
          <p className="mb-1 text-sm text-gray-700">
            <strong>Hourly Rate:</strong> Rs: {job.price_per_hour}
          </p>
          <p className="mb-1 text-sm text-gray-700">
            <strong>Hours Required:</strong> {job.hours}
          </p>
          <p className="mb-1 text-sm text-gray-700">
            <strong>Posted By:</strong> {job.employer_id.name}
          </p>
        </div>

        <div className="mt-2">
          <button
            onClick={() => setShowOfferModal(true)}
            className="block w-full px-4 py-2 mb-2 font-bold text-center text-white bg-blue-500 rounded hover:bg-blue-700"
          >
            Negotiate
          </button>
          <button
            onClick={handleChatClick}
            className="block w-full px-4 py-2 font-bold text-center text-white bg-green-500 rounded hover:bg-green-700"
            disabled={loading}
          >
            {loading ? "Loading..." : "Chat"}
          </button>
        </div>
      </div>

      {showOfferModal && (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-75">
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="mb-4 text-lg font-semibold">Negotiate</h2>
            <label className="block mb-2">
              Rate Per Hour:
              <input
                type="number"
                className="block w-full mt-1 border-2 border-gray-700 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                min="1"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
              />
            </label>
            <label className="block mb-4">
              Hours Required:
              <input
                type="number"
                className="block w-full mt-1 border-2 border-gray-700 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                min="1"
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
              />
            </label>

            <div className="flex justify-end">
              <button
                onClick={handleNegotiate}
                className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
              >
                Submit
              </button>
              <button
                onClick={() => setShowOfferModal(false)}
                className="px-4 py-2 ml-2 text-gray-700 bg-gray-300 rounded-md hover:bg-gray-400 focus:outline-none"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobCard;
