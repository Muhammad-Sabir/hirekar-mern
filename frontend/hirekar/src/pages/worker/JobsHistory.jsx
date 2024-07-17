import React, { useState, useEffect } from 'react';
import { FaCircle } from 'react-icons/fa';
import { RiArrowRightDoubleFill, RiArrowLeftDoubleFill } from 'react-icons/ri';

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
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [newPrice, setNewPrice] = useState('');
    const [newHours, setNewHours] = useState('');

    const jobsPerPage = 10;

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:8000/api/job/history', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setJobs(data);
                } else {
                    console.error('Failed to fetch jobs');
                    // Handle error
                }
            } catch (error) {
                console.error('Error fetching jobs:', error);
                // Handle error
            }
        };

        fetchJobs();

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

    const handleModalAction = async (jobId, status) => {
        try {
            let jobData = { job_id: jobId, status };

            if (status === 'negotiating') {
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
            console.error('Error accepting job:', error);
            // Handle error if needed
        }
    };

    const updateJobStatus = async (jobData) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8000/api/job/update', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(jobData),
            });
            if (response.ok) {
                // Job updated successfully
            } else {
                console.error('Failed to update job');
                // Handle error
            }
        } catch (error) {
            console.error('Error updating job:', error);
            // Handle error
        }
    };

    const refreshJobs = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8000/api/job/history', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setJobs(data);
            } else {
                console.error('Failed to fetch jobs for refresh');
                // Handle error
            }
        } catch (error) {
            console.error('Error refreshing jobs:', error);
            // Handle error
        }
    };

    const renderModal = () => {
        if (!selectedJob) return null;

        return (
            <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-700 bg-opacity-75 z-50">
                <div className="bg-white p-6 rounded-md shadow-lg">
                    <h2 className="text-lg font-semibold mb-4">Accept Job</h2>
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
                    {selectedJob.status !== 'negotiating' && (
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
                            onClick={() => handleModalAction(selectedJob._id, 'pending')}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md mr-4 hover:bg-blue-600"
                        >
                            Accept without changes
                        </button>
                        <button
                            onClick={() => handleModalAction(selectedJob._id, 'negotiating')}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            Accept with changes
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const renderTable = () => (
        <table className="min-w-full bg-white shadow-md rounded-md mt-4">
            <thead className="text-justify">
                <tr className="bg-gray-100">
                    <th className="py-2 px-4 font-medium">Name</th>
                    <th className="py-2 px-4 font-medium">Description</th>
                    <th className="py-2 px-4 font-medium">Price Rs/hr</th>
                    <th className="py-2 px-4 font-medium">Status</th>
                    <th className="py-2 px-4 font-medium">Actions</th>
                </tr>
            </thead>
            <tbody>
                {currentJobs.map((job, index) => (
                    <tr key={index} className="border-t">
                        <td className="py-2 px-4 text-sm">{job.title}</td>
                        <td className="py-2 px-4 text-sm">{job.description}</td>
                        <td className="py-2 px-4 text-sm">{job.price_per_hour}</td>
                        <td className={`py-2 px-4 flex items-center text-sm ${getStatusColor(job.status)}`}>
                            <FaCircle className="mr-2" style={{ color: getStatusColor(job.status) }} />
                            {job.status}
                        </td>
                        <td className="py-2 px-4">
                            {job.status === 'requested' && (
                                <>
                                    <button
                                        onClick={() => setSelectedJob(job)}
                                        className="text-blue-500 hover:text-blue-600 mr-2"
                                    >
                                        Accept
                                    </button>
                                    <button
                                        onClick={() => handleModalAction(job._id, 'unassigned')}
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
                <div key={index} className="bg-white shadow-md rounded-md p-2">
                    <h3 className="text-md font-semibold">{job.title}</h3>
                    <p className="text-sm text-gray-600">Date: {job.description}</p>
                    <p className="text-sm text-gray-600">Price Rs/hr: {job.price_per_hour}</p>
                    <div className={`flex items-center text-sm ${getStatusColor(job.status)}`}>
                        <FaCircle className="mr-2" style={{ color: getStatusColor(job.status) }} />
                        {job.status}
                    </div>
                    {job.status === 'requested' && (
                        <div className="mt-2">
                            <button
                                onClick={() => setSelectedJob(job)}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md mr-2 hover:bg-blue-600"
                            >
                                Accept
                            </button>
                            <button
                                onClick={() => handleModalAction(job._id, 'unassigned')}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
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
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={() => paginate(currentPage === 1 ? 1 : currentPage - 1)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md mr-2 hover:bg-blue-600"
                    >
                        <RiArrowLeftDoubleFill className="inline-block mr-2" />
                        Prev
                    </button>
                    <button
                        onClick={() => paginate(currentPage + 1)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
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
