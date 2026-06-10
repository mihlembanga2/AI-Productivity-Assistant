import { useState, useEffect } from "react";
import { Outlet, createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Plus, Trash2, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { UIMessage } from "ai";

export interface ChatThread {
  id: string;
  title: string;
  updatedAt: string;
  messages: UIMessage[];
}

const STORAGE_KEY = "ai-assistant-threads";

export function getStoredThreads(): ChatThread[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ChatThread[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveThreads(threads: ChatThread[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
}

export function generateThreadId() {
  return `thread_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chat — AI Workplace Assistant" },
      { name: "description", content: "Chat with AI for brainstorming, advice, and ideation." },
    ],
  }),
  component: ChatLayout,
});

function ChatLayout() {
  const navigate = useNavigate({ from: "/chat" });
  const [threads, setThreads] = useState<ChatThread[]>(() => {
    if (typeof window !== "undefined") {
      const stored = getStoredThreads();
      if (stored.length > 0) return stored;
      const defaultThread: ChatThread = {
        id: generateThreadId(),
        title: "New Conversation",
        updatedAt: new Date().toISOString(),
        messages: [],
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify([defaultThread]));
      return [defaultThread];
    }
    return [];
  });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const currentPath = typeof window !== "undefined"
    ? window.location.pathname
    : "/chat";
  const activeThreadId = currentPath.startsWith("/chat/")
    ? currentPath.replace("/chat/", "")
    : null;

  const createNewThread = () => {
    const newThread: ChatThread = {
      id: generateThreadId(),
      title: "New Conversation",
      updatedAt: new Date().toISOString(),
      messages: [],
    };
    const updated = [newThread, ...threads];
    setThreads(updated);
    saveThreads(updated);
    navigate({ to: "/chat/$threadId", params: { threadId: newThread.id } });
    setMobileSidebarOpen(false);
  };

  const deleteThread = (e: React.MouseEvent, threadId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = threads.filter((t) => t.id !== threadId);
    setThreads(updated);
    saveThreads(updated);
    if (activeThreadId === threadId) {
      if (updated.length > 0) {
        navigate({ to: "/chat/$threadId", params: { threadId: updated[0].id } });
      } else {
        navigate({ to: "/chat" });
      }
    }
  };

  return (
    <div className="flex h-[calc(100vh-3rem)]">
      {/* Mobile toggle */}
      <div className="lg:hidden absolute top-2 left-2 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        >
          {mobileSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Thread sidebar */}
      <AnimatePresence>
        {(mobileSidebarOpen || typeof window === "undefined" || window.innerWidth >= 1024) && (
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.2 }}
            className={`
              w-[280px] flex-shrink-0 border-r bg-sidebar flex flex-col
              ${mobileSidebarOpen ? "fixed inset-y-0 left-0 z-40 lg:relative lg:inset-auto" : "hidden lg:flex"}
            `}
          >
            <div className="p-3 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-sidebar-foreground" />
                <span className="text-sm font-medium text-sidebar-foreground">Conversations</span>
              </div>
              <Button variant="ghost" size="icon" onClick={createNewThread} className="h-7 w-7">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-2 space-y-1">
                {threads.map((thread) => (
                  <div key={thread.id} className="group relative flex items-center">
                    <Link
                      to="/chat/$threadId"
                      params={{ threadId: thread.id }}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`
                        flex-1 flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors
                        ${activeThreadId === thread.id
                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        }
                      `}
                    >
                      <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{thread.title}</span>
                    </Link>
                    <button
                      onClick={(e) => deleteThread(e, thread.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-sidebar-accent transition-opacity"
                    >
                      <Trash2 className="h-3 w-3 text-sidebar-foreground/60" />
                    </button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat area */}
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}
