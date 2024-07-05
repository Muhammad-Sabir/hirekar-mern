import { Link } from "react-router-dom";
import dummyChats from "../data/dummyChats";

const RecentChats = () => {
  const currentUrl = window.location.href;
  const hasWorkerPath = currentUrl.includes("/worker");

  return (
    <div className="w-full p-4 pt-4 pb-8 pl-8 pr-8">
      <h2 className="mb-2 text-lg font-semibold">Your Recent Chats:</h2>
      <div className="space-y-4">
        {dummyChats.map((chat, index) => (
          <Link
            key={index}
            to={
              hasWorkerPath
                ? `/worker/chats/${chat.user}`
                : `/employer/chats/${chat.user}`
            }
            className="block p-4 transition duration-300 ease-in-out rounded-lg shadow-md hover:shadow-lg hover:bg-gray-100"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <strong className="font-normal text-blue-600 text-md">
                  {chat.user}
                </strong>
                <span className="text-sm text-gray-500">{chat.date}</span>
              </div>
              <p className="text-sm text-gray-800">{chat.message}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentChats;
