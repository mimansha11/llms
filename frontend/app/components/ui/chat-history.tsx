import { useState } from "react";
import { Message } from "./chat/chat.interface";

interface ChatHistoryProps {
  chats: Array<{ id: string; messages: Message[] }>;
  onChatSelect: (id: string) => void;
  selectedChatId: string | null;
}

export default function ChatHistory({
  chats,
  onChatSelect,
  selectedChatId,
}: ChatHistoryProps) {
  return (
    <div className="w-1/4 bg-gray-100 p-4 rounded-xl shadow-md h-[75vh] overflow-y-auto space-y-2">
      <h2 className="text-lg font-semibold mb-4">Chat History</h2>
      {chats.map((chat) => (
        <div
          key={chat.id}
          onClick={() => onChatSelect(chat.id)}
          className={`p-3 cursor-pointer rounded-lg ${
            chat.id === selectedChatId ? "bg-blue-500 text-white" : "bg-white"
          }`}
        >
          Chat {chat.id}
        </div>
      ))}
    </div>
  );
}
