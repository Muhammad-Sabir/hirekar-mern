import React, { useState, useEffect } from 'react';
import SearchBar from '../../components/SearchBar';
import WorkerCard from '../../components/WorkerCard';

function Workers() {
    const [searchTerm, setSearchTerm] = useState("");
    const [workers, setWorkers] = useState([]);
    const [filteredWorkers, setFilteredWorkers] = useState([]);

    useEffect(() => {
        const fetchWorkers = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/workers", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                const data = await response.json();
                setWorkers(data);
                setFilteredWorkers(data); // Initialize filtered workers with all workers
            } catch (error) {
                console.error("Error fetching workers:", error);
            }
        };
        fetchWorkers();
    }, []);

    const handleSearchChange = (event) => {
        const query = event.target.value;
        setSearchTerm(query);
        filterWorkers(query);
    };

    const filterWorkers = (query) => {
        const filtered = workers.filter(
            (worker) =>
                worker.name.toLowerCase().includes(query.toLowerCase()) ||
                (worker.designation &&
                    worker.designation.toLowerCase().includes(query.toLowerCase())) ||
                (worker.skills &&
                    worker.skills.join(", ").toLowerCase().includes(query.toLowerCase())) ||
                (worker.city && worker.city.toLowerCase().includes(query.toLowerCase()))
        );
        setFilteredWorkers(filtered);
    };

    return (
        <div className="w-full p-4 pt-4 pb-8 pl-8 pr-8">
            <SearchBar value={searchTerm} onChange={handleSearchChange} />

            <h2 className="mb-2 text-lg font-semibold mt-8">All Workers:</h2>
            <div className="gap-4 flex flex-wrap">
                {filteredWorkers.map((worker) => (
                    <WorkerCard
                        key={worker._id}
                        name={worker.name}
                        designation={worker.designation || "N/A"}
                        skills={worker.skills.join(", ") || "N/A"}
                        experience={worker.years_of_experience || "N/A"}
                        pricePerHour={worker.hourly_rate || "N/A"}
                        location={worker.city || "N/A"}
                    />
                ))}
            </div>
        </div>
    );
}

export default Workers;


{/* <div className="max-w-4xl mx-auto mb-6">
        <input
          type="text"
          placeholder="Search workers..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full px-4 py-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div> */}