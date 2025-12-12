import { useEffect, useRef } from "react";
import { cn } from "../../lib/utils";
import type { Message } from "../../types";

export function ConversationPanel({ messages }: { messages: Message[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="text-center py-8">
          <p className="text-gray-500">Press the microphone button to start a conversation</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <div ref={scrollRef} className="max-h-64 overflow-y-auto space-y-4 scroll-smooth">
        {messages.map((msg, i) => (
          <div key={i} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
            <div className={cn("max-w-[80%] rounded-2xl px-4 py-2",
              msg.role === "user" ? "bg-primary-500 text-white rounded-br-md" : "bg-gray-100 text-gray-800 rounded-bl-md"
            )}>
              <p className="text-sm">{msg.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
