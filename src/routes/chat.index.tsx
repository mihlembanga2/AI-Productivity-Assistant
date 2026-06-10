import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { getStoredThreads, generateThreadId } from "./chat";

export const Route = createFileRoute("/chat/")({
  head: () => ({
    meta: [
      { title: "AI Chat — AI Workplace Assistant" },
      { name: "description", content: "Chat with AI for brainstorming, advice, and ideation." },
    ],
  }),
  component: ChatIndex,
});

function ChatIndex() {
  const navigate = useNavigate({ from: "/chat" });

  useEffect(() => {
    const threads = getStoredThreads();
    if (threads.length > 0) {
      navigate({ to: "/chat/$threadId", params: { threadId: threads[0].id } });
    } else {
      const newThread = {
        id: generateThreadId(),
        title: "New Conversation",
        updatedAt: new Date().toISOString(),
        messages: [],
      };
      const updated = [newThread];
      localStorage.setItem("ai-assistant-threads", JSON.stringify(updated));
      navigate({ to: "/chat/$threadId", params: { threadId: newThread.id } });
    }
  }, [navigate]);

  return null;
}
