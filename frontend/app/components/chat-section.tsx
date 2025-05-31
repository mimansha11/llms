"use client";

import { useState } from "react";
import { useChat } from "ai/react";
import ChatInput from "./ui/chat/chat-input";
import ChatMessages from "./ui/chat/chat-messages";
import ChatSidebar from "./ui/chat-sidebar";
import { Button } from "./ui/button";

// Example user logo as an image or icon (use your logo URL here)
const userLogo = "/user.png"; // replace with your user logo path or URL

export default function ChatSection() {
  const [chats, setChats] = useState<{ id: string; title: string }[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState("GPT-3.5 Turbo");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Track dropdown visibility

  const { messages, input, isLoading, handleSubmit, handleInputChange, reload, stop } = useChat({
    api: process.env.NEXT_PUBLIC_CHAT_API,
    headers: {
      "Content-Type": "application/json",
      "Model": selectedModel,
    },
  });

  const handleNewChat = async () => {
    try {
      const newChat = { id: `chat-${Date.now()}`, title: "New Chat" };

      await fetch("http://localhost:8000/api/chat/history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      setChats([newChat, ...chats]);
      setSelectedChat(newChat.id);

      location.reload();
    } catch (error) {
      console.error("Error creating new chat:", error);
    }
  };

  const handleSelectChat = (id: string) => {
    setSelectedChat(id);
  };

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev); // Toggle the dropdown visibility
  };

  const handleLogout = () => {
    // Handle logout logic here
    console.log("Logging out...");
    // You can call an API to log out, clear local storage, or redirect the user
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Top bar with New Chat button and model selector */}
      <div className="absolute top-4 right-4 z-10 flex items-center space-x-4">
        {/* New Chat button */}
        <Button
          variant="outline"
          onClick={handleNewChat}
          className="p-2 border rounded-md bg-white dark:bg-gray-700 font-bold"
        >
          New Chat
        </Button>

        {/* GPT-3.5 Turbo Selector */}
        <select
          className="p-2 border rounded-md bg-white dark:bg-gray-700 font-bold"
          value={selectedModel}
          onChange={(e) => handleModelChange(e.target.value)}
        >
          <option value="Llama 3.1 8b" className="font-bold">
            Llama 3.1 8b
          </option>
          <option value="mistral:instruct" className="font-bold">
            mistral:instruct
          </option>
        </select>

        {/* User Logo with Dropdown */}
        <div className="relative">
          <img
            src={userLogo}
            alt="User Logo"
            className="w-8 h-8 rounded-full ml-2 cursor-pointer"
            onClick={toggleDropdown} // Toggle the dropdown on click
          />

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-grow">
        {/* Sidebar */}
        <ChatSidebar
          chats={chats}
          onSelectChat={handleSelectChat}
        />

        {/* Main chat area */}
        <div className="ml-80 flex-grow p-4 space-y-4">
          <ChatMessages
            messages={messages}
            isLoading={isLoading}
            reload={reload}
            stop={stop}
          />
          <ChatInput
            input={input}
            handleSubmit={handleSubmit}
            handleInputChange={handleInputChange}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}


