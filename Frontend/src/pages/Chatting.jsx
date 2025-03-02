import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";

export default function Chatting() {
  const userId = JSON.parse(localStorage.getItem("userData"))._id; // current logged-in user
  const { anotherGuyId = null } = useParams();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const [connections, setConnections] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(true);
  const chatContainerRef = useRef(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Connect to Socket.IO
    const newSocket = io(BACKEND_URL);
    setSocket(newSocket);

    // Notify server user is online
    newSocket.emit("userOnline", userId);

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Fetch user data and connections
  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_URL}/user/${userId}`);
      const connectionsData = response.data.connections;

      // Fetch details for each connection
      const connectionPromises = connectionsData.map((connectionId) =>
        axios.get(`${BACKEND_URL}/user/${connectionId}`)
      );

      const connectionResults = await Promise.all(connectionPromises);
      const connectionUsers = connectionResults.map((res) => res.data);
      setConnections(connectionUsers);

      // Set initial selected user if anotherGuyId is provided
      if (anotherGuyId) {
        const initialUser = connectionUsers.find(
          (user) => user._id === anotherGuyId
        );
        if (initialUser) {
          setSelectedUser(initialUser);
          await fetchMessages(initialUser._id);
        }
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setLoading(false);
    }
  };

  // Fetch messages between current user and selected user
  const fetchMessages = async (recipientId) => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/${userId}/${recipientId}`
      );
      console.log("Fetched Messages are : ", response.data);

      setMessages(response.data);

      // Scroll logic remains the same
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]);
    }
  };

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (message) => {
      if (message.sender === selectedUser?._id || message.sender === userId) {
        setMessages((prev) => [...prev, message]);
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);
    return () => socket.off("receiveMessage", handleReceiveMessage);
  }, [socket, selectedUser]);

  // Handle sending a new message
  const sendMessage = async () => {
    if (!messageInput.trim() || !selectedUser) return;

    const messageData = {
      senderId: userId,
      recipientId: selectedUser._id,
      content: messageInput,
    };

    // Optimistic update
    const tempMessage = {
      _id: Date.now().toString(),
      sender: userId,
      recipient: selectedUser._id,
      content: messageInput,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, tempMessage]);
    setMessageInput("");

    // Emit via Socket.IO
    socket.emit("sendMessage", messageData);

    // Scroll to bottom
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  // Select a user to chat with
  const handleSelectUser = async (user) => {
    setSelectedUser(user);
    await fetchMessages(user._id);
  };

  useEffect(() => {
    fetchUserData();

    // Polling for new messages (every 10 seconds)
    const intervalId = setInterval(() => {
      if (selectedUser) {
        fetchMessages(selectedUser._id);
      }
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar with connections */}
      <div className="w-1/4 border-r border-gray-800 overflow-y-auto">
        <div className="p-4 bg-gray-900 border-b border-gray-800">
          <h2 className="text-xl font-bold text-blue-400">Connections</h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="text-blue-400">Loading connections...</div>
          </div>
        ) : (
          <div>
            {connections.length === 0 ? (
              <div className="p-4 text-gray-400">No connections found</div>
            ) : (
              connections.map((connection) => (
                <div
                  key={connection._id}
                  className={`flex items-center p-3 hover:bg-gray-900 cursor-pointer transition-colors
                    ${selectedUser && selectedUser._id === connection._id
                      ? "bg-gray-800"
                      : ""
                    }`}
                  onClick={() => handleSelectUser(connection)}
                >
                  <div className="relative">
                    <img
                      src={
                        connection.image ||
                        "https://cdn-icons-png.flaticon.com/512/10398/10398223.png"
                      }
                      alt={connection.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
                  </div>
                  <div className="ml-3">
                    <div className="font-semibold">{connection.name}</div>
                    <div className="text-sm text-gray-400">
                      {connection.email}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {/* Chat header */}
        {selectedUser ? (
          <div className="p-4 bg-gray-900 border-b border-gray-800 flex items-center">
            <img
              src={
                selectedUser.image ||
                "https://cdn-icons-png.flaticon.com/512/10398/10398223.png"
              }
              alt={selectedUser.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="ml-3">
              <div className="font-semibold">{selectedUser.name}</div>
              <div className="text-xs text-gray-400">{selectedUser.about}</div>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-gray-900 border-b border-gray-800">
            <div className="font-semibold text-gray-400">
              Select a connection to start chatting
            </div>
          </div>
        )}

        {/* Messages area */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-900 to-black"
        >
          {selectedUser ? (
            messages.length > 0 ? (
              <div className="space-y-3">
                {messages.map((message) => (
                  <div
                    key={message._id}
                    className={`flex ${message.sender === userId
                      ? "justify-end"
                      : "justify-start"
                      }`}
                  >
                    <div
                      className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${message.sender === userId
                        ? "bg-blue-900 text-white rounded-br-none"
                        : "bg-gray-800 text-white rounded-bl-none"
                        }`}
                    >
                      {message.content}
                      <div className="text-xs text-gray-400 mt-1 text-right">
                        {new Date(message.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="text-gray-500">
                  No messages yet. Start a conversation!
                </div>
              </div>
            )
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-gray-500">
                Select a connection to view messages
              </div>
            </div>
          )}
        </div>

        {/* Message input */}
        {selectedUser && (
          <div className="p-4 bg-gray-900 border-t border-gray-800">
            <div className="flex">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 bg-gray-800 text-white rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                onClick={sendMessage}
                className="bg-blue-800 hover:bg-blue-700 text-white rounded-r-lg px-4 py-2 transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
