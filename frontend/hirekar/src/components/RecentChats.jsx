import React from 'react';
import { Link } from 'react-router-dom';
import dummyChats from '../data/dummyChats';

const RecentChats = () => {

    return (
        <div className="w-full p-4 pt-4 pb-8 pl-8 pr-8">
            <h2 className="text-lg font-semibold mb-2">Your Recent Chats:</h2>
            <div className="space-y-4">
                {dummyChats.map((chat, index) => (
                    <Link key={index} to={`/worker/chats/${chat.user}`} className="block rounded-lg shadow-md p-4 hover:shadow-lg hover:bg-gray-100 transition duration-300 ease-in-out">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <strong className="text-blue-600 text-md font-normal">{chat.user}</strong>
                                <span className="text-gray-500 text-sm">{chat.date}</span>
                            </div>
                            <p className="text-gray-800 text-sm">{chat.message}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default RecentChats;
