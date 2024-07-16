import React, { useState, useEffect } from 'react';
import SearchBarWithFilters from '../../components/SearchBar';
import WorkerCard from '../../components/WorkerCard';
import { calculateAverageRating } from '../../../utils/calculateAvgRating';

function Workers() {
    const [workers, setWorkers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        designation: '',
        hourlyRate: '',
        rating: ''
    });
    const [filteredWorkers, setFilteredWorkers] = useState([]);

    useEffect(() => {
        const fetchWorkers = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/worker/all", {
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

    useEffect(() => {
        const applyFilters = () => {
            let filtered = workers;

            if (searchTerm) {
                filtered = filtered.filter(worker =>
                    worker.user.name.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

            if (filters.designation) {
                filtered = filtered.filter(worker =>
                    worker.designation && worker.designation.toLowerCase() === filters.designation.toLowerCase()
                );
            }

            if (filters.hourlyRate) {
                const [min, max] = filters.hourlyRate.split('-').map(rate => parseInt(rate, 10));
                filtered = filtered.filter(worker =>
                    worker.hourly_rate >= min && worker.hourly_rate <= max
                );
            }

            if (filters.rating) {
                filtered = filtered.filter(worker =>
                    calculateAverageRating(worker.reviews) >= parseInt(filters.rating, 10)
                );
            }

            setFilteredWorkers(filtered);
        };

        applyFilters();
    }, [workers, searchTerm, filters]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <div className="w-full p-4 pt-4 pb-8 pl-8 pr-8">
            <SearchBarWithFilters
                searchTerm={searchTerm}
                handleSearchChange={handleSearchChange}
                filters={filters}
                handleFilterChange={handleFilterChange}
            />

            <h2 className="mb-2 text-lg font-semibold mt-8">All Workers:</h2>
            <div className="gap-4 flex flex-wrap">
                {filteredWorkers.map((worker) => (
                    <WorkerCard
                        key={worker._id}
                        id={worker.user._id}
                        userId={worker._id}
                        name={worker.user.name}
                        designation={worker.designation || "N/A"}
                        skills={worker.skills.join(", ") || "N/A"}
                        hourlyRate={worker.hourly_rate || "N/A"}
                        rating={calculateAverageRating(worker.reviews)}
                        phoneNo={worker.user.phone_number || "N/A"}
                    />
                ))}
            </div>
        </div>
    );
}

export default Workers;
