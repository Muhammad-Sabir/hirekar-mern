import { useState } from "react";
import { GrUserWorker } from "react-icons/gr";
import { BsChatSquareQuote } from "react-icons/bs";
import { FaRegFileLines } from "react-icons/fa6";
import { Link } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const Sidebar = ({ isOpen }) => {
  const currentUrl = window.location.href;
  const hasWorkerPath = currentUrl.includes("/worker");

  const [activeItem, setActiveItem] = useState(
    hasWorkerPath ? "jobs" : "workers"
  );

  let sidebarItems = [];

  if (hasWorkerPath) {
    sidebarItems = [
      { key: "jobs", icon: <GrUserWorker />, name: "Jobs", url: "/worker/" },
      {
        key: "resume",
        icon: <FaRegFileLines />,
        name: "Resume",
        url: "/worker/resume",
      },
      {
        key: "chats",
        icon: <BsChatSquareQuote />,
        name: "Chats",
        url: "/worker/chats",
      },
    ];
  } else {
    sidebarItems = [
      {
        key: "workers",
        icon: <GrUserWorker />,
        name: "Workers List",
        url: "/employer/",
      },
      {
        key: "chats",
        icon: <BsChatSquareQuote />,
        name: "Chats",
        url: "/employer/chats",
      },
    ];
  }

  const handleItemClick = (itemKey) => {
    setActiveItem(itemKey);
  };

  return (
    <div
      className={`fixed left-0 top-12 bottom-0 w-64 bg-white h-[calc(100%-3rem)] p-4 pt-4 pb-12 pl-4 pr-4 transition-transform transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      style={{ borderRight: "1px solid #ccc" }}
    >
      <ul className="space-y-4">
        {sidebarItems.map((item) => (
          <Link
            to={item.url}
            key={item.key}
            className={`flex items-center cursor-pointer p-2 rounded-md ${
              activeItem === item.key
                ? "bg-blue-600 text-white"
                : "bg-white text-blue-500 hover:bg-blue-100"
            }`}
            onClick={() => handleItemClick(item.key)}
          >
            <div className="mr-2">{item.icon}</div> {item.name}
          </Link>
        ))}
      </ul>
      <button
        type="submit"
        className="absolute bottom-4 left-4 w-[calc(100%-2rem)] py-2 text-white transition duration-300 rounded-lg bg-red-500 hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
