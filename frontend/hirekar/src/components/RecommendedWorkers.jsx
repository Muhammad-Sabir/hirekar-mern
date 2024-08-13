import { useState, useEffect } from "react";
import WorkerCard from "./WorkerCard";
import { calculateAverageRating } from "../../utils/calculateAvgRating";

function Recommendations() {
  const [workers, setWorkers] = useState([]);

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await fetch(
          "http://hirekar-frontend.s3-website.eu-north-1.amazonaws.com/api/worker/recommended",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        setWorkers(data);
      } catch (error) {
        console.error("Error fetching workers:", error);
      }
    };
    fetchWorkers();
  }, []);

  return (
    <div className="w-full p-4 pt-4 pb-8 pl-8 pr-8">
      <h2 className="mb-2 text-lg font-semibold">Recommended Workers:</h2>

      <div className="flex flex-wrap">
        {workers.map((worker) => (
          <WorkerCard
            key={worker.user._id}
            id={worker.user._id}
            userId={worker._id}
            className="w-full p-2 sm:w-1/2 md:w-1/3 lg:w-1/4"
            name={worker.user.name}
            designation={worker.designation || "N/A"}
            skills={worker.skills.join(", ") || "N/A"}
            hourlyRate={worker.hourly_rate || "N/A"}
            rating={calculateAverageRating(worker.reviews)}
            phoneNo={worker.user.phone_number || "N/A"}
          />
        ))}
      </div>
    </div>
  );
}

export default Recommendations;
