import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Mail,
  FileText,
  CheckSquare,
  Search,
  MessageSquare,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AI Workplace Productivity Assistant" },
      { name: "description", content: "Your central hub for AI-powered workplace productivity tools." },
      { property: "og:title", content: "Dashboard — AI Workplace Productivity Assistant" },
      { property: "og:description", content: "Your central hub for AI-powered workplace productivity tools." },
    ],
  }),
  component: Dashboard,
});

const tools = [
  {
    title: "Smart Email Generator",
    description: "Craft polished emails in seconds with AI-powered tone and content suggestions.",
    icon: Mail,
    url: "/email",
    color: "bg-[#38BDF8]/10",
    iconColor: "text-[#38BDF8]",
  },
  {
    title: "Meeting Notes Summarizer",
    description: "Transform raw meeting notes into structured summaries and action items.",
    icon: FileText,
    url: "/meeting-notes",
    color: "bg-[#818CF8]/10",
    iconColor: "text-[#818CF8]",
  },
  {
    title: "AI Task Planner",
    description: "Generate structured task plans with priorities, timelines, and milestones.",
    icon: CheckSquare,
    url: "/task-planner",
    color: "bg-[#C084FC]/10",
    iconColor: "text-[#C084FC]",
  },
  {
    title: "AI Research Assistant",
    description: "Get comprehensive research summaries with structured insights and sources.",
    icon: Search,
    url: "/research",
    color: "bg-[#38BDF8]/10",
    iconColor: "text-[#38BDF8]",
  },
  {
    title: "AI Chatbot",
    description: "Have an intelligent conversation for brainstorming, advice, and ideation.",
    icon: MessageSquare,
    url: "/chat",
    color: "bg-[#818CF8]/10",
    iconColor: "text-[#818CF8]",
  },
];

function Dashboard() {
  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#C084FC]">Welcome to Workplace AI</h1>
              <p className="text-sm text-muted-foreground">
                Automate workplace tasks with AI-powered tools.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool, i) => (
            <motion.div
              key={tool.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
            >
              <Link to={tool.url}>
                <Card className="group h-full cursor-pointer transition-shadow hover:shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${tool.color}`}>
                        <tool.icon className={`h-5 w-5 ${tool.iconColor}`} />
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                    <CardTitle className="text-base mt-3">{tool.title}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        <ResponsibleAiDisclaimer className="mt-8" />
      </motion.div>
    </div>
  );
}

export function ResponsibleAiDisclaimer({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground ${className}`}>
      <p className="font-medium text-foreground mb-1">Responsible AI Use</p>
      <p>
        AI-generated content is a starting point — always review, edit, and verify outputs before use. 
        Do not share sensitive personal, financial, or confidential information. AI outputs may contain errors or biases.
      </p>
    </div>
  );
}
