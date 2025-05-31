import { useState, useEffect } from "react";

interface ChatSidebarProps {
  chats: { id: string; title: string }[];
  onSelectChat: (id: string) => void;
}

export default function ChatSidebar({
  chats,
  onSelectChat,
}: ChatSidebarProps) {
  const [chatHistory, setChatHistory] = useState<{ id: string; preview: string }[]>([]);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const response = await fetch("http://localhost:8000/api/chat/history");
        const data = await response.json();
        const formattedChats = data.history.map((conversation: { role: string; content: string }[], index: number) => {
          const lastMessage =
            conversation.length > 0 ? conversation[conversation.length - 1].content : "New conversation";
          return {
            id: `chat-${index}`,
            preview: lastMessage.slice(0, 50) + "...",
          };
        });
        setChatHistory(formattedChats);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    }

    fetchHistory();
  }, []);

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-gray-100 dark:bg-gray-800 p-4 space-y-4">
      {/* Chat History Title */}
      <div className="font-bold text-lg">Chat History</div>

      <div className="flex-grow overflow-y-auto">
        {chatHistory.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className="p-2 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {chat.preview}
          </div>
        ))}
      </div>
    </div>
  );
}
