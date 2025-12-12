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
      <div className="bg-gradient-card rounded-xl shadow-card border border-slate-200 p-8 mb-6">
        <div className="text-center py-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent-50 flex items-center justify-center">
            <svg className="w-8 h-8 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">Ready to find your perfect meal</h3>
          <p className="text-slate-500">Press the microphone button below to tell me what you're craving</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-card rounded-xl shadow-card border border-slate-200 p-6 mb-6">
      <div ref={scrollRef} className="max-h-64 overflow-y-auto space-y-4 scroll-smooth">
        {messages.map((msg, i) => (
          <div key={i} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
            <div className={cn("max-w-[80%] rounded-2xl px-4 py-3 shadow-sm",
              msg.role === "user" ? "bg-gradient-accent text-white rounded-br-md" : "bg-slate-100 text-slate-700 rounded-bl-md border border-slate-200"
            )}>
              <p className="text-sm leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
