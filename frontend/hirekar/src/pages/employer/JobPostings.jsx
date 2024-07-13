import React, { useState, useEffect } from 'react';
import { FaCircle } from 'react-icons/fa';
import dummyJobs from '../../data/dummyJobs';
import { RiArrowRightDoubleFill, RiArrowLeftDoubleFill } from "react-icons/ri";
import { Link } from 'react-router-dom';

const getStatusColor = (status) => {
    let colorClass = 'text-gray-800';

    if (status.toLowerCase() === 'active') {
        colorClass = 'text-green-500';
    } else if (status.toLowerCase() === 'pending') {
        colorClass = 'text-red-500';
    } else if (status.toLowerCase() === 'complete') {
        colorClass = 'text-blue-500';
    }

    return colorClass;
};

const truncateDescription = (description, wordLimit) => {
  const words = description.split(' ');
  if (words.length <= wordLimit) {
      return description;
  }
  return words.slice(0, wordLimit).join(' ') + '...';
};


const JobPostings = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [isMobileView, setIsMobileView] = useState(false);
    const jobsPerPage = 10;

    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth < 576);
        };

        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = dummyJobs.slice(indexOfFirstJob, indexOfLastJob);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const renderTable = () => (
        <table className="min-w-full bg-white shadow-md rounded-md mt-6 mb-4">
            <thead className="text-justify">
                <tr className="bg-gray-100">
                    <th className="py-2 px-4 font-medium">Name</th>
                    <th className="py-2 px-4 font-medium">Description</th>
                    <th className="py-2 px-4 font-medium">Assigned to</th>
                    <th className="py-2 px-4 font-medium">Status</th>
                </tr>
            </thead>
            <tbody>
                {currentJobs.map((job, index) => (
                    <tr key={index} className="border-t">
                        <td className="py-2 px-4 text-sm">{job.title}</td>
                        <td className="py-2 px-4 text-sm">{truncateDescription(job.description, 8)}</td>
                        <td className={`py-2 px-4 text-sm ${job.assignedTo ? '' : 'text-red-500'}`}>
                            {job.assignedTo || 'Not Assigned'}
                        </td>
                        <td className={`py-2 px-4 flex items-center text-sm ${getStatusColor(job.status)}`}>
                            <FaCircle className="mr-2" style={{ color: getStatusColor(job.status) }} />
                            {job.status}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    const renderList = () => (
        <div className="grid grid-cols-1 gap-4 mt-4">
            {currentJobs.map((job, index) => (
                <div key={index} className="bg-white shadow-md rounded-md p-2">
                    <h3 className="text-md font-semibold">{job.title}</h3>
                    <p className="text-sm text-gray-600">Description: {truncateDescription(job.description, 10)}</p>
                    <p className="text-sm text-gray-600">Assigned to: {job.assignedTo}</p>
                    <div className={`flex items-center text-sm ${getStatusColor(job.status)}`}>
                        <FaCircle className="mr-2" style={{ color: getStatusColor(job.status) }} />
                        {job.status}
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="w-full p-4 pt-4 pb-12 pl-8 pr-8">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">Your Jobs:</h2>
                <Link to={'/employer/jobPostingForm'} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                    Create Job
                </Link>
            </div>
            {isMobileView ? renderList() : renderTable()}
            <div className="flex justify-end mt-6">
                <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 mr-2 ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                >
                    <RiArrowLeftDoubleFill className='text-xl'/>
                </button>
                <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={indexOfLastJob >= dummyJobs.length}
                    className={`px-3 py-1 ${indexOfLastJob >= dummyJobs.length ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}>
                    <RiArrowRightDoubleFill className='text-xl'/>
                </button>
            </div>
        </div>
    );
};

export default JobPostings;
