import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const HiringForm = () => {
  const { user, user_id } = useParams();
  const [selectedJobId, setSelectedJobId] = useState("");
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(
          "http://hirekar-frontend.s3-website.eu-north-1.amazonaws.com/api/job/all",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        const unassignedJobs = data.filter(
          (job) => job.status === "unassigned"
        );
        setJobs(unassignedJobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  const handleChange = (e) => {
    setSelectedJobId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      job_id: selectedJobId,
      worker_id: user_id,
    };

    try {
      const response = await fetch(
        "http://hirekar-frontend.s3-website.eu-north-1.amazonaws.com/api/job/assign",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData),
        }
      );
      const result = await response.json();
      console.log("Job assigned:", result);
      alert(`Request to ${user} has been sent to accept the job offer`);
    } catch (error) {
      console.error("Error assigning job:", error);
    }
  };

  return (
    <div className="w-full p-4 pt-4 pb-12 pl-8 pr-8">
      <h2 className="text-lg font-semibold mb-2">Hire {user} for Your Job:</h2>
      <p className="text-sm mb-4">
        Please fill out the following details to hire {user} for your job.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <h3 className="font-semibold mb-3 mt-5">Enter Job Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <select
                name="jobType"
                value={selectedJobId}
                onChange={handleChange}
                className="w-full px-4 text-sm text-gray-400 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a job</option>
                {jobs.map((job) => (
                  <option key={job._id} value={job._id}>
                    {job.title} - {job.description}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="flex mt-8">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Hire {user}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HiringForm;
