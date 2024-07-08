import { useState, useEffect } from "react";
import WorkerCard from "../../components/WorkerCard";

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
        setFilteredWorkers(data);
      } catch (error) {
        console.error("Error fetching workers:", error);
      }
    };
    fetchWorkers();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    filterWorkers(event.target.value);
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
    <div className="min-h-screen py-10 bg-gray-100">
      <h1 className="mb-10 text-3xl font-bold text-center">Available Workers</h1>
      <div className="max-w-4xl mx-auto mb-6">
        <input
          type="text"
          placeholder="Search workers..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full px-4 py-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex flex-wrap justify-center">
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
