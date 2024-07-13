import React, { useState } from 'react';
import { MdNotificationsActive } from "react-icons/md";

const Notification = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const notifications = [
    "You have a new message.",
    "Your job listing has been viewed 10 times.",
    "Today's schedule: 10:00 AM meeting with client."
    // Add more notifications as needed
  ];

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <div className="relative">
        <MdNotificationsActive className="h-6 w-6 relative z-10 text-white" onClick={toggleNotifications} />
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden">
          <div className="p-4 bg-gray-100 border-b border-gray-200">
            <h3 className="text-md font-semibold text-gray-800">Notifications</h3>
          </div>
          <ul className="divide-y divide-gray-200 text-sm">
            {notifications.map((notification, index) => (
              <li key={index} className="p-4 cursor-pointer hover:bg-gray-50">
                {notification}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Notification;
