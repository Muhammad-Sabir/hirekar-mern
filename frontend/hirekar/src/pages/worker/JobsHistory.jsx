import { useState, useEffect } from "react";
import { FaCircle } from "react-icons/fa";
import { RiArrowRightDoubleFill, RiArrowLeftDoubleFill } from "react-icons/ri";

const getStatusColor = (status) => {
  let colorClass = "text-gray-800";

  if (status.toLowerCase() === "active") {
    colorClass = "text-green-500";
  } else if (status.toLowerCase() === "pending") {
    colorClass = "text-yellow-500";
  } else if (status.toLowerCase() === "completed") {
    colorClass = "text-blue-500";
  }

  return colorClass;
};

const Jobs = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileView, setIsMobileView] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [newPrice, setNewPrice] = useState("");
  const [newHours, setNewHours] = useState("");

  const jobsPerPage = 10;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://16.171.195.37/api/job/history", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setJobs(data);
        } else {
          console.error("Failed to fetch jobs");
          // Handle error
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        // Handle error
      }
    };

    fetchJobs();

    const handleResize = () => {
      setIsMobileView(window.innerWidth < 576);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleModalAction = async (jobId, status) => {
    try {
      let jobData = { job_id: jobId, status };

      if (status === "negotiating") {
        // Include newPrice and newHours in the API call
        jobData = { ...jobData, price_per_hour: newPrice, hours: newHours };
      }

      // Call API to update job status and possibly other fields
      await updateJobStatus(jobData);

      // Refresh job data after update
      refreshJobs();

      // Close the modal
      setSelectedJob(null);
    } catch (error) {
      console.error("Error accepting job:", error);
      // Handle error if needed
    }
  };

  const updateJobStatus = async (jobData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://16.171.195.37/api/job/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(jobData),
      });
      if (response.ok) {
        alert(`Job status is updated as: ${jobData.status}`);
      } else {
        console.error("Failed to update job");
        // Handle error
      }
    } catch (error) {
      console.error("Error updating job:", error);
      // Handle error
    }
  };

  const refreshJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://16.171.195.37/api/job/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setJobs(data);
      } else {
        console.error("Failed to fetch jobs for refresh");
        // Handle error
      }
    } catch (error) {
      console.error("Error refreshing jobs:", error);
      // Handle error
    }
  };

  const renderModal = () => {
    if (!selectedJob) return null;

    return (
      <div className="fixed top-0 bottom-0 left-0 right-0 z-50 flex items-center justify-center bg-gray-700 bg-opacity-75">
        <div className="p-6 bg-white rounded-md shadow-lg">
          <h2 className="mb-4 text-lg font-semibold">Accept Job</h2>
          <p className="mb-4">Do you want to accept this job?</p>
          <div className="mb-4">
            <label className="block mb-2">Current Price $/hr:</label>
            <input
              type="text"
              value={selectedJob.price_per_hour}
              className="px-3 py-1 border rounded-md"
              readOnly
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Current Hours:</label>
            <input
              type="text"
              value={selectedJob.hours}
              className="px-3 py-1 border rounded-md"
              readOnly
            />
          </div>
          {selectedJob.status !== "negotiating" && (
            <>
              <div className="mb-4">
                <label className="block mb-2">New Price $/hr:</label>
                <input
                  type="text"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="px-3 py-1 border rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">New Hours:</label>
                <input
                  type="text"
                  value={newHours}
                  onChange={(e) => setNewHours(e.target.value)}
                  className="px-3 py-1 border rounded-md"
                />
              </div>
            </>
          )}
          <div className="flex justify-end">
            <button
              onClick={() => handleModalAction(selectedJob._id, "pending")}
              className="px-4 py-2 mr-4 text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              Accept without changes
            </button>
            <button
              onClick={() => handleModalAction(selectedJob._id, "negotiating")}
              className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              Accept with changes
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderTable = () => (
    <table className="min-w-full mt-4 bg-white rounded-md shadow-md">
      <thead className="text-justify">
        <tr className="bg-gray-100">
          <th className="px-4 py-2 font-medium">Name</th>
          <th className="px-4 py-2 font-medium">Description</th>
          <th className="px-4 py-2 font-medium">Price Rs/hr</th>
          <th className="px-4 py-2 font-medium">Status</th>
          <th className="px-4 py-2 font-medium">Actions</th>
        </tr>
      </thead>
      <tbody>
        {currentJobs.map((job, index) => (
          <tr key={index} className="border-t">
            <td className="px-4 py-2 text-sm">{job.title}</td>
            <td className="px-4 py-2 text-sm">{job.description}</td>
            <td className="px-4 py-2 text-sm">{job.price_per_hour}</td>
            <td
              className={`py-2 px-4 flex items-center text-sm ${getStatusColor(
                job.status
              )}`}
            >
              <FaCircle
                className="mr-2"
                style={{ color: getStatusColor(job.status) }}
              />
              {job.status}
            </td>
            <td className="px-4 py-2">
              {job.status === "requested" && (
                <>
                  <button
                    onClick={() => setSelectedJob(job)}
                    className="mr-2 text-blue-500 hover:text-blue-600"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleModalAction(job._id, "unassigned")}
                    className="text-red-500 hover:text-red-600"
                  >
                    Reject
                  </button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderList = () => (
    <div className="grid grid-cols-1 gap-4 mt-4">
      {currentJobs.map((job, index) => (
        <div key={index} className="p-2 bg-white rounded-md shadow-md">
          <h3 className="font-semibold text-md">{job.title}</h3>
          <p className="text-sm text-gray-600">Date: {job.description}</p>
          <p className="text-sm text-gray-600">
            Price Rs/hr: {job.price_per_hour}
          </p>
          <div
            className={`flex items-center text-sm ${getStatusColor(
              job.status
            )}`}
          >
            <FaCircle
              className="mr-2"
              style={{ color: getStatusColor(job.status) }}
            />
            {job.status}
          </div>
          {job.status === "requested" && (
            <div className="mt-2">
              <button
                onClick={() => setSelectedJob(job)}
                className="px-4 py-2 mr-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
              >
                Accept
              </button>
              <button
                onClick={() => handleModalAction(job._id, "unassigned")}
                className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full p-4 pt-4 pb-12 pl-8 pr-8">
      <h2 className="mb-2 text-lg font-semibold">Your Current Jobs:</h2>
      {isMobileView ? renderList() : renderTable()}
      {jobs.length > jobsPerPage && (
        <div className="flex justify-end mt-4">
          <button
            onClick={() => paginate(currentPage === 1 ? 1 : currentPage - 1)}
            className="px-4 py-2 mr-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            <RiArrowLeftDoubleFill className="inline-block mr-2" />
            Prev
          </button>
          <button
            onClick={() => paginate(currentPage + 1)}
            className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Next
            <RiArrowRightDoubleFill className="inline-block ml-2" />
          </button>
        </div>
      )}
      {renderModal()}
    </div>
  );
};

export default Jobs;
