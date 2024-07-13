import React from 'react';
import { CiSearch } from "react-icons/ci";

const SearchBarWithFilters = () => {
  return (
    <div className="mt-3 flex flex-col">
      <div className="w-full max-w-screen mb-3">
        <div className="flex items-center border border-gray-300 rounded-lg text-sm">
          <div className="p-3">
          <CiSearch className='text-xl text-gray-500'/>
          </div>
          <input
            type="text"
            placeholder="Search workers..."
            className="w-full sm:w-3/5 px-4 py-2 pl-0 border-none focus:outline-none"
          />
        </div>
      </div>

      <div className="w-full grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm">
        <div className="w-50% sm:w-60%">
          <select className="w-full text-gray-400 p-2 border border-gray-300 rounded-lg focus:outline-none">
            <option value="">Select Location</option>
            <option value="new-york">New York</option>
            <option value="san-francisco">San Francisco</option>
            <option value="chicago">Chicago</option>
          </select>
        </div>

        <div className="w-full sm:w-60%">
          <select className="w-full text-gray-400 p-2 border border-gray-300 rounded-lg focus:outline-none ">
            <option value="">Select Price Range</option>
            <option value="0-50">$0 - $50</option>
            <option value="51-100">$51 - $100</option>
            <option value="101-200">$101 - $200</option>
          </select>
        </div>

        <div className="w-full sm:w-60%">
          <select className="w-full p-2 text-gray-400 border border-gray-300 rounded-lg focus:outline-none ">
            <option value="">Sort By</option>
            <option value="low-to-high">Low to High</option>
            <option value="high-to-low">High to Low</option>
          </select>
        </div>

        <div className="w-full sm:w-60%">
          <select className="w-full text-gray-400 p-2 border border-gray-300 rounded-lg focus:outline-none ">
            <option value="">Select Skills</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchBarWithFilters;
