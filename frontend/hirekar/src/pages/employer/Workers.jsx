import { useState } from "react";
import WorkerCard from "../../components/WorkerCard";

function Workers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredWorkers, setFilteredWorkers] = useState(workersData);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    filterWorkers(event.target.value);
  };

  const filterWorkers = (query) => {
    const filtered = workersData.filter(
      (worker) =>
        worker.name.toLowerCase().includes(query.toLowerCase()) ||
        worker.designation.toLowerCase().includes(query.toLowerCase()) ||
        worker.skill.toLowerCase().includes(query.toLowerCase()) ||
        worker.location.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredWorkers(filtered);
  };

  return (
    <div className="min-h-screen py-10 bg-gray-100">
      <h1 className="mb-10 text-3xl font-bold text-center">
        Available Workers
      </h1>
      <div className="max-w-4xl mx-auto mb-6">
        <input
          type="text"
          placeholder="Search workers..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full px-4 py-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex flex-wrap justify-center ">
        {filteredWorkers.map((worker, index) => (
          <WorkerCard
            key={index}
            name={worker.name}
            designation={worker.designation}
            skill={worker.skill}
            experience={worker.experience}
            pricePerHour={worker.pricePerHour}
            location={worker.location}
          />
        ))}
      </div>
    </div>
  );
}

export default Workers;


var workersData = [
    {
      name: "John Smith",
      designation: "Carpenter",
      skill: "Woodworking, Furniture Making",
      experience: 8,
      pricePerHour: 20,
      location: "New York",
    },
    {
      name: "Jane Doe",
      designation: "Electrician",
      skill: "Wiring, Circuit Repair",
      experience: 5,
      pricePerHour: 25,
      location: "Los Angeles",
    },
    {
      name: "Mike Johnson",
      designation: "Plumber",
      skill: "Pipe Installation, Leak Repair",
      experience: 10,
      pricePerHour: 30,
      location: "Chicago",
    },
    {
      name: "Sarah Williams",
      designation: "Painter",
      skill: "Wall Painting, Spray Painting",
      experience: 6,
      pricePerHour: 18,
      location: "San Francisco",
    },
    {
      name: "John Smith",
      designation: "Carpenter",
      skill: "Woodworking, Furniture Making",
      experience: 8,
      pricePerHour: 20,
      location: "New York",
    },
    {
      name: "Jane Doe",
      designation: "Electrician",
      skill: "Wiring, Circuit Repair",
      experience: 5,
      pricePerHour: 25,
      location: "Los Angeles",
    },
    {
      name: "Mike Johnson",
      designation: "Plumber",
      skill: "Pipe Installation, Leak Repair",
      experience: 10,
      pricePerHour: 30,
      location: "Chicago",
    },
    {
      name: "Sarah Williams",
      designation: "Painter",
      skill: "Wall Painting, Spray Painting",
      experience: 6,
      pricePerHour: 18,
      location: "San Francisco",
    },
    {
      name: "John Smith",
      designation: "Carpenter",
      skill: "Woodworking, Furniture Making",
      experience: 8,
      pricePerHour: 20,
      location: "New York",
    },
    {
      name: "Jane Doe",
      designation: "Electrician",
      skill: "Wiring, Circuit Repair",
      experience: 5,
      pricePerHour: 25,
      location: "Los Angeles",
    },
    {
      name: "Mike Johnson",
      designation: "Plumber",
      skill: "Pipe Installation, Leak Repair",
      experience: 10,
      pricePerHour: 30,
      location: "Chicago",
    },
    {
      name: "Sarah Williams",
      designation: "Painter",
      skill: "Wall Painting, Spray Painting",
      experience: 6,
      pricePerHour: 18,
      location: "San Francisco",
    },
    {
      name: "John Smith",
      designation: "Carpenter",
      skill: "Woodworking, Furniture Making",
      experience: 8,
      pricePerHour: 20,
      location: "New York",
    },
    {
      name: "Jane Doe",
      designation: "Electrician",
      skill: "Wiring, Circuit Repair",
      experience: 5,
      pricePerHour: 25,
      location: "Los Angeles",
    },
    {
      name: "Mike Johnson",
      designation: "Plumber",
      skill: "Pipe Installation, Leak Repair",
      experience: 10,
      pricePerHour: 30,
      location: "Chicago",
    },
    {
      name: "Sarah Williams",
      designation: "Painter",
      skill: "Wall Painting, Spray Painting",
      experience: 6,
      pricePerHour: 18,
      location: "San Francisco",
    },
  ];