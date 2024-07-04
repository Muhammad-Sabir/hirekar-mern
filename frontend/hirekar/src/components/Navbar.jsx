import React, { useState } from 'react';
import { MdMenu, MdClose } from 'react-icons/md';

const Navbar = ({ toggleSidebar, sidebarOpen }) => {
  return (
    <nav className="bg-black p-3 px-6 fixed top-0 w-full flex justify-between items-center z-10">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="text-white mr-4">
          {sidebarOpen ? <MdClose className="text-2xl" /> : <MdMenu className="text-2xl" />}
        </button>
        <span className="text-white font-bold">Hirekar</span>
      </div>
      <div className="text-white">Hello, Worker</div>
    </nav>
  );
};

export default Navbar;
