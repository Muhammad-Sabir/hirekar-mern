import { useState, useEffect } from "react";
import WorkerCard from "../../components/WorkerCard";
import SearchBar from "../../components/SearchBar";

function SearchResultList() {
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
        console.log(data)
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
    console.log(query)
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
      <SearchBar/>
      <h2 className="mb-2 text-lg font-semibold mt-8">Search Results:</h2>
      <div className="gap-4 flex flex-wrap">
        {workers.map((worker) => (
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

export default SearchResultList;
