import { useState, useEffect } from "react";
import JobCard from "../../components/JobCard";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);

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
        setJobs(data);

        const updatedJobs = data.filter((job) => job.status === "unassigned");
        setFilteredJobs(updatedJobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
    fetchJobs();
  }, []);

  const handleFilteredJobs = async (newJob) => {
    const updatedJobs = jobs.map((job) =>
      job._id === newJob._id ? newJob : job
    );

    setJobs(updatedJobs);

    const updatedFilteredJobs = updatedJobs.filter(
      (job) => job.status === "unassigned"
    );

    setFilteredJobs(updatedFilteredJobs);
  };

  return (
    <div className="w-full p-4 pt-4 pb-8 pl-8 pr-8">
      <h2 className="mt-8 mb-2 text-lg font-semibold">All Jobs:</h2>
      <div className="flex flex-wrap">
        {filteredJobs.map((job) => (
          <JobCard
            key={job._id}
            job={job}
            jobs={jobs}
            handleFilteredJobs={handleFilteredJobs}
          />
        ))}
      </div>
    </div>
  );
}

export default Jobs;
