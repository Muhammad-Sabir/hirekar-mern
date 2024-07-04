import React, { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa6';
import { FaUserCircle } from "react-icons/fa";
import { Link, useParams } from 'react-router-dom';
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";


const ChatBox = () => {
    const { user } = useParams()
    console.log(user)

    const [messages, setMessages] = useState([
        { id: 1, user: user, message: 'Hey, how are you?' },
        { id: 2, user: 'You', message: 'I\'m good, thanks!' },
        { id: 3, user: user, message: 'Want to grab coffee later?' },
        { id: 4, user: 'You', message: 'Sure, what time?' },
    ]);
    const [newMessage, setNewMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;
        const updatedMessages = [...messages, { id: messages.length + 1, user: 'You', message: newMessage }];
        setMessages(updatedMessages);
        setNewMessage('');
    };

    return (
        <>
            <div className="bg-white w-full p-4 flex items-center justify-between border-b border-gray-200 shadow-md">
                <div className="flex items-center">
                    <Link to='/worker/chats' className="mr-4">
                        <MdKeyboardDoubleArrowLeft className='text-2xl text-blue-600' />
                    </Link>
                    <FaUserCircle className='text-2xl text-gray-800 mr-2' />
                    <span className="text-lg font-semibold text-gray-800"> {user}</span>
                </div>
            </div>

            <div className="flex flex-col h-[80vh] bg-gray-100 p-4 pt-4 pb-0 pl-8 pr-8">
                <div className="flex-1 overflow-y-auto">
                    {messages.map((msg, index) => (
                        <div key={msg.id} className={`flex ${msg.user === 'You' ? 'justify-end' : 'justify-start'} mb-4`}>
                            <div className={`max-w-xs mx-2 px-4 py-2 rounded-lg shadow-md ${msg.user === 'You' ? 'bg-blue-600 text-white self-end' : 'bg-white text-gray-800'}`}>
                                <p>{msg.user === 'You' ? 'You' : user}: {msg.message}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="flex items-center justify-between p-4 bg-white">
                    <input
                        type="text"
                        className="flex-1 mr-2 py-2 px-4 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-600"
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none"
                    > Send
                    </button>
                </form>
            </div>
        </>

    );
};

export default ChatBox;
