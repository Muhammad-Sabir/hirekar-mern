import { useState, useEffect } from "react";
import { FaCircle } from "react-icons/fa";
import { RiArrowRightDoubleFill, RiArrowLeftDoubleFill } from "react-icons/ri";

const getStatusColor = (status) => {
  let colorClass = "text-gray-800";

  if (status.toLowerCase() === "requested") {
    colorClass = "text-green-500";
  } else if (status.toLowerCase() === "pending") {
    colorClass = "text-yellow-500";
  } else if (status.toLowerCase() === "completed") {
    colorClass = "text-blue-500";
  } else if (status.toLowerCase() === "rejected") {
    colorClass = "text-red-500";
  }

  return colorClass;
};

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/jobs/history", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        setError("Error fetching jobs. Please try again.");
      }
    };

    fetchJobs();
  }, []);

  const updateJobStatus = async (id, reqStatus) => {
    const response = await fetch(`http://localhost:8000/api/jobs/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        status: reqStatus,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update job status.");
    }

    const updatedJob = await response.json();

    setJobs((prevJobs) =>
      prevJobs.map((job) => (job._id === updatedJob._id ? updatedJob : job))
    );
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileView, setIsMobileView] = useState(false);
  const jobsPerPage = 10;

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 576);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const renderActionButtons = (job) => {
    if (job.status === "requested") {
      return (
        <>
          <button
            onClick={() => updateJobStatus(job._id, "pending")}
            className="p-1 mr-2 border-2 rounded-md"
          >
            Accept
          </button>
          <button
            onClick={() => updateJobStatus(job._id, "rejected")}
            className="p-1 border-2 rounded-md"
          >
            Reject
          </button>
        </>
      );
    } else if (job.status === "pending") {
      return (
        <button
          onClick={() => updateJobStatus(job._id, "completed")}
          className="p-1 mr-2 border-2 rounded-md"
        >
          Mark Complete
        </button>
      );
    } else {
      return null;
    }
  };

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderTable = () => (
    <table className="min-w-full mt-4 text-center bg-white rounded-md shadow-md">
      <thead className="text-center">
        <tr className="bg-gray-100">
          <th className="px-4 py-2 font-medium">Name</th>
          <th className="px-4 py-2 font-medium">Description</th>
          <th className="px-4 py-2 font-medium">Price Rs./hr</th>
          <th className="px-4 py-2 font-medium">Status</th>
          <th className="px-4 py-2 font-medium">Action</th>
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
            <td className="px-4 py-2 text-sm">{renderActionButtons(job)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderList = () => (
    <div className="grid grid-cols-1 gap-4 mt-4">
      {currentJobs.map((job, index) => (
        <div key={index} className="p-2 bg-white rounded-md shadow-md">
          <h3 className="font-semibold text-md">{job.name}</h3>
          <p className="text-sm text-gray-600">Date: {job.date}</p>
          <p className="text-sm text-gray-600">Price $/hr: {job.price}</p>
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
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full p-4 pt-4 pb-12 pl-8 pr-8">
      <h2 className="mb-2 text-lg font-semibold">Your Jobs:</h2>
      {error && <p className="mt-4 text-red-600">{error}</p>}
      {isMobileView ? renderList() : renderTable()}
      <div className="flex justify-end mt-4">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 mr-2 ${
            currentPage === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          <RiArrowLeftDoubleFill className="text-xl" />
        </button>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={indexOfLastJob >= jobs.length}
          className={`px-3 py-1 ${
            indexOfLastJob >= jobs.length
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          <RiArrowRightDoubleFill className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default Jobs;
