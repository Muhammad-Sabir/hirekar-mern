import React, { useState, useEffect } from 'react';
import { FaCircle } from 'react-icons/fa';
import { jobs } from '../data/jobsData';
import { RiArrowRightDoubleFill, RiArrowLeftDoubleFill } from "react-icons/ri";

const getStatusColor = (status) => {
    let colorClass = 'text-gray-800';

    if (status.toLowerCase() === 'active') {
        colorClass = 'text-green-500';
    } else if (status.toLowerCase() === 'pending') {
        colorClass = 'text-yellow-500';
    } else if (status.toLowerCase() === 'completed') {
        colorClass = 'text-blue-500';
    }

    return colorClass;
};

const Jobs = () => {
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
    const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const renderTable = () => (
        <table className="min-w-full bg-white shadow-md rounded-md mt-4">
            <thead className="text-justify">
                <tr className="bg-gray-100">
                    <th className="py-2 px-4 font-medium">Name</th>
                    <th className="py-2 px-4 font-medium">Date</th>
                    <th className="py-2 px-4 font-medium">Price $/hr</th>
                    <th className="py-2 px-4 font-medium">Status</th>
                </tr>
            </thead>
            <tbody>
                {currentJobs.map((job, index) => (
                    <tr key={index} className="border-t">
                        <td className="py-2 px-4 text-sm">{job.name}</td>
                        <td className="py-2 px-4 text-sm">{job.date}</td>
                        <td className="py-2 px-4 text-sm">{job.price}</td>
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
                    <h3 className="text-md font-semibold">{job.name}</h3>
                    <p className="text-sm text-gray-600">Date: {job.date}</p>
                    <p className="text-sm text-gray-600">Price $/hr: {job.price}</p>
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
            <h2 className="text-lg font-semibold mb-2">Your Jobs:</h2>
            {isMobileView ? renderList() : renderTable()}
            <div className="flex justify-end mt-4">
                <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 mr-2 ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                >
                    <RiArrowLeftDoubleFill className='text-xl'/>
                </button>
                <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={indexOfLastJob >= jobs.length}
                    className={`px-3 py-1 ${indexOfLastJob >= jobs.length ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}>
                    <RiArrowRightDoubleFill className='text-xl'/>
                </button>
            </div>
        </div>
    );
};

export default Jobs;
