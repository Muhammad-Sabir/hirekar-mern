import { useState, useEffect } from "react";
import { FaCircle } from "react-icons/fa";
import { RiArrowRightDoubleFill, RiArrowLeftDoubleFill } from "react-icons/ri";
import { Link } from "react-router-dom";

const getStatusColor = (status) => {
  let colorClass = "text-gray-800";

  if (status.toLowerCase() === "requested") {
    colorClass = "text-gray-500";
  } else if (status.toLowerCase() === "negotiating") {
    colorClass = "text-blue-500";
  } else if (status.toLowerCase() === "pending") {
    colorClass = "text-red-500";
  } else if (status.toLowerCase() === "completed") {
    colorClass = "text-green-500";
  } else if (status.toLowerCase() === "unassigned") {
    colorClass = "text-yellow-500";
  }

  return colorClass;
};

const truncateDescription = (description, wordLimit) => {
  const words = description.split(" ");
  if (words.length <= wordLimit) {
    return description;
  }
  return words.slice(0, wordLimit).join(" ") + "...";
};

const JobPostings = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileView, setIsMobileView] = useState(false);
  const jobsPerPage = 10;
  const [showModal, setShowModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("http://16.171.195.37/api/job/history/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error("Error fetching Jobs:", error);
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

  const handleReviewClick = (job) => {
    setSelectedJob(job);
    setShowModal(true);
    console.log("JOB: ", job);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setRating(0);
    setReviewText("");
    setSelectedJob(null);
  };

  const handleReviewSubmit = async () => {
    console.log(selectedJob);
    try {
      const response = await fetch("http://16.171.195.37/api/review/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          worker_id: selectedJob.worker_id._id,
          job_id: selectedJob._id,
          rating,
          review: reviewText,
        }),
      });
      if (response.ok) {
        // Handle success, e.g., close modal, refresh data, etc.
        handleModalClose();
        alert("Review added successfully!");
      } else {
        // Handle error
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    } catch (error) {
      console.error("Error adding review:", error);
      // Handle error
      alert("Failed to add review. Please try again.");
    }
  };

  const handleViewOfferClick = (job) => {
    setSelectedJob(job);
    setShowOfferModal(true);
  };

  const handleOfferModalClose = () => {
    setShowOfferModal(false);
    setSelectedJob(null);
  };

  const handleOfferUpdate = async (action) => {
    const newJob = { ...selectedJob, status: action };

    console.log(selectedJob);

    const response = await fetch("http://16.171.195.37/api/job/update", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        job_id: newJob._id,
        status: action,
        price_per_hour: newJob.price_per_hour,
        hours: newJob.hours,
      }),
    });

    if (response.ok) {
      const updatedJobs = jobs.map((job) =>
        job._id === newJob._id ? newJob : job
      );

      setJobs(updatedJobs);
      handleOfferModalClose();
      alert(`Jobs is now ${action}!`);
    } else {
      // Handle error
      const errorData = await response.json();
      throw new Error(errorData.message);
    }
  };

  const handleCompletedClick = (job) => {
    job.status = "almost-completed";

    setSelectedJob(job);
  };

  useEffect(() => {
    if (selectedJob && selectedJob.status === "almost-completed") {
      handleOfferUpdate("completed");
    }
  }, [selectedJob]);

  const handleSetRating = (val) => {
    console.log("Setting rating, ", val);
    if (val > 5 || val < 0) {
      return;
    }

    setRating(val);
  };

  const renderAction = (job) => {
    if (job.status.toLowerCase() === "completed") {
      return (
        <button
          onClick={() => handleReviewClick(job)}
          className="text-blue-500 hover:underline focus:outline-none"
        >
          Add Review
        </button>
      );
    } else if (job.status.toLowerCase() === "negotiating") {
      return (
        <>
          <button
            onClick={() => handleViewOfferClick(job)}
            className="text-blue-500 hover:underline focus:outline-none"
          >
            View Offer
          </button>
        </>
      );
    } else if (job.status.toLowerCase() === "pending") {
      return (
        <>
          <button
            onClick={() => handleCompletedClick(job)}
            className="text-blue-500 hover:underline focus:outline-none"
          >
            Mark Completed
          </button>
        </>
      );
    } else {
      return <></>;
    }
  };

  const renderTable = () => (
    <table className="min-w-full mt-6 mb-4 bg-white rounded-md shadow-md">
      <thead className="text-justify">
        <tr className="bg-gray-100">
          <th className="px-4 py-2 font-medium">Name</th>
          <th className="px-4 py-2 font-medium">Description</th>
          <th className="px-4 py-2 font-medium">Assigned to</th>
          <th className="px-4 py-2 font-medium">Status</th>
          <th className="px-4 py-2 font-medium">Actions</th>
        </tr>
      </thead>
      <tbody>
        {currentJobs.map((job, index) => (
          <tr key={index} className="border-t">
            <td className="px-4 py-2 text-sm">{job.title}</td>
            <td className="px-4 py-2 text-sm">
              {truncateDescription(job.description, 8)}
            </td>
            <td
              className={`py-2 px-4 text-sm ${
                job.worker_id ? "" : "text-red-500"
              }`}
            >
              {job.worker_id ? job.worker_id.user.name : "Not Assigned"}
            </td>
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
            <td className="px-4 py-2 text-sm">{renderAction(job)}</td>
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
          <p className="text-sm text-gray-600">
            Description: {truncateDescription(job.description, 10)}
          </p>
          {job.worker_id ? (
            <>
              <p className="text-sm text-gray-600">
                Assigned to: {job.worker_id.user.name}
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-600">Assigned to: Not Assigned</p>
          )}
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
          {job.status.toLowerCase() === "completed" && (
            <div className="mt-2">
              <button
                onClick={() => handleReviewClick(job)}
                className="text-blue-500 hover:underline focus:outline-none"
              >
                Add Review
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full p-4 pt-4 pb-12 pl-8 pr-8">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">Your Jobs:</h2>
        <Link
          to={"/employer/jobPostingForm"}
          className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
        >
          Create Job
        </Link>
      </div>
      {isMobileView ? renderList() : renderTable()}

      {showModal && (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-75">
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="mb-4 text-lg font-semibold">Add Review</h2>
            <label className="block mb-2">
              Rating:
              <input
                type="number"
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                min="1"
                max="5"
                value={rating}
                onChange={(e) => handleSetRating(Number(e.target.value))}
              />
            </label>
            <label className="block mb-4">
              Review:
              <textarea
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                rows="4"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
            </label>
            <div className="flex justify-end">
              <button
                onClick={handleReviewSubmit}
                className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
              >
                Submit
              </button>
              <button
                onClick={handleModalClose}
                className="px-4 py-2 ml-2 text-gray-700 bg-gray-300 rounded-md hover:bg-gray-400 focus:outline-none"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showOfferModal && (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-75">
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="mb-4 text-lg font-semibold">Final Job Offer</h2>
            <label className="block mb-2">
              Price Per Hour:
              <p className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                {selectedJob.price_per_hour}
              </p>
            </label>
            <label className="block mb-4">
              Hours Required:
              <p className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                {selectedJob.hours}
              </p>
            </label>
            <label className="block mb-4">
              Total Price:
              <p className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                {selectedJob.hours * selectedJob.price_per_hour}
              </p>
            </label>
            <div className="flex justify-end">
              <button
                onClick={() => handleOfferUpdate("pending")}
                className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
              >
                Accept
              </button>
              <button
                onClick={() => handleOfferUpdate("unassigned")}
                className="px-4 py-2 ml-2 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none"
              >
                Reject
              </button>
              <button
                onClick={handleOfferModalClose}
                className="px-4 py-2 ml-2 text-gray-700 bg-gray-300 rounded-md hover:bg-gray-400 focus:outline-none"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end mt-6">
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

export default JobPostings;
