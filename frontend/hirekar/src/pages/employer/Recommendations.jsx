import React, { useState, useEffect } from 'react';
import SearchBar from '../../components/SearchBar';
import WorkerCard from '../../components/WorkerCard';

function Recommendations() {
    const [workers, setWorkers] = useState([]);

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

            } catch (error) {
                console.error("Error fetching workers:", error);
            }
        };
        fetchWorkers();
    }, []);

    return (
        <div className="w-full p-4 pt-4 pb-8 pl-8 pr-8">
            <h2 className="mb-2 text-lg font-semibold">Recommended Workers:</h2>

            <div className="gap-4 flex flex-wrap">
                {workers.map((worker) => (
                    <WorkerCard
                        key={worker._id}
                        className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2"
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

export default Recommendations;
