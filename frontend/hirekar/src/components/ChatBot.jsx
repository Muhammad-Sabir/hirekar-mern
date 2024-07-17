import { useState } from "react";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "user" }]);
      try {
        const response = await fetch("http://localhost:8000/api/chatbot", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ question: input }),
        });
        const data = await response.json();
        setMessages([
          ...messages,
          { text: input, sender: "user" },
          { text: data.answer, sender: "bot" },
        ]);
      } catch (error) {
        console.error("Error:", error);
        setMessages([
          ...messages,
          { text: input, sender: "user" },
          { text: "I'm sorry, something went wrong.", sender: "bot" },
        ]);
      }
      setInput("");
    }
  };

  return (
    <div className="fixed z-50 bottom-5 right-5">
      <button
        className="px-4 py-2 text-white bg-blue-500 rounded-full"
        onClick={toggleChatbot}
      >
        {isOpen ? "Close Chat" : "Chat with us"}
      </button>
      {isOpen && (
        <div className="flex flex-col mt-2 overflow-hidden bg-white border border-gray-300 rounded-lg shadow-lg w-80 max-h-96">
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-2 ${
                  message.sender === "user" ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block px-3 py-2 rounded-lg ${
                    message.sender === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex border-t border-gray-300"
          >
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border-none focus:ring-0"
              required
            />
            <button type="submit" className="px-4 py-2 text-white bg-blue-500">
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
