import React from 'react';
import { CiSearch } from "react-icons/ci";

const SearchBar = ({ searchTerm, handleSearchChange, filters, handleFilterChange }) => {
  return (
    <div className="mt-3 flex flex-col">
      <div className="w-full max-w-screen mb-3">
        <div className="flex items-center border border-gray-300 rounded-lg text-sm">
          <div className="p-3">
            <CiSearch className='text-xl text-gray-500'/>
          </div>
          <input
            type="text"
            placeholder="Search workers by name..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full sm:w-3/5 px-4 py-2 pl-0 border-none focus:outline-none"
          />
        </div>
      </div>

      <div className="w-full grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 text-sm">
        <div className="w-full sm:w-60%">
          <select
            name="designation"
            value={filters.designation}
            onChange={handleFilterChange}
            className="w-full text-gray-400 p-2 border border-gray-300 rounded-lg focus:outline-none"
          >
            <option value="">Select Designation</option>
            <option value="Driver">Driver</option>
            <option value="Plumber">Plumber</option>
            <option value="Electrician">Electrician</option>
            <option value="Gardener">Gardener</option>
          </select>
        </div>

        <div className="w-full sm:w-60%">
          <select
            name="hourlyRate"
            value={filters.hourlyRate}
            onChange={handleFilterChange}
            className="w-full text-gray-400 p-2 border border-gray-300 rounded-lg focus:outline-none"
          >
            <option value="">Select Hourly Rate</option>
            <option value="0-500">0 - 500</option>
            <option value="500-1000">500 - 1000</option>
            <option value="1000-2000">1000 - 2000</option>
          </select>
        </div>

        <div className="w-full sm:w-60%">
          <select
            name="rating"
            value={filters.rating}
            onChange={handleFilterChange}
            className="w-full text-gray-400 p-2 border border-gray-300 rounded-lg focus:outline-none"
          >
            <option value="">Select Rating</option>
            <option value="1">1+ Star</option>
            <option value="2">2+ Stars</option>
            <option value="3">3+ Stars</option>
            <option value="4">4+ Stars</option>
            <option value="5">5+ Stars</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
