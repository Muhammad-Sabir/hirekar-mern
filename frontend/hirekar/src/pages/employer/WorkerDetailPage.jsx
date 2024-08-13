import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const WorkerDetailsPage = () => {
  const { worker_id } = useParams();
  const [worker, setWorker] = useState(null);

  useEffect(() => {
    const fetchWorkerDetails = async () => {
      try {
        const response = await fetch(
          `http://16.171.195.37/api/worker/${worker_id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        setWorker(data);
      } catch (error) {
        console.error("Error fetching worker details:", error);
      }
    };

    fetchWorkerDetails();
  }, [worker_id]);

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return "Not Rated";

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;
    return averageRating.toFixed(1);
  };

  if (!worker) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full pt-4 pb-12 pr-8">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="">
          <h2 className="text-2xl font-semibold text-blue-500">
            {worker.user.name}
          </h2>
          <p className="text-gray-500">{worker.user.email}</p>
          <p className="mt-4 text-sm">Address: {worker.user.address}</p>
          <p className="mt-2 text-sm">
            Phone Number: {worker.user.phone_number}
          </p>
          <p className="mt-2 text-sm">Designation: {worker.designation}</p>
          <p className="mt-2 text-sm">Hourly Rate: {worker.hourly_rate} Rs</p>
          <p className="mt-2 text-sm">Skills: {worker.skills.join(", ")}</p>
          <p className="mt-2 text-sm mb-6">
            Average Rating: {calculateAverageRating(worker.reviews)}
          </p>
        </div>
        <hr />
        <div className="border-t">
          <h3 className="mt-4 text-lg font-semibold">Reviews:</h3>
          <div className=" text-sm">
            {worker.reviews.length > 0 ? (
              worker.reviews.map((review, index) => (
                <div key={index} className="p-2 border-b mt-2 ">
                  <p className="text-gray-600">
                    Rated {review.rating} by{" "}
                    {review.employer_id ? review.employer_id.name : "Unknown"}
                  </p>
                  <p className="mt-2 mb-2">{review.review}</p>
                </div>
              ))
            ) : (
              <p className="p-6 text-gray-600">No reviews available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerDetailsPage;
