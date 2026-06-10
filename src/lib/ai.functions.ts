import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";

const GenerateEmailInput = z.object({
  recipient: z.string().min(1),
  purpose: z.string().min(1),
  tone: z.enum(["professional", "friendly", "formal", "casual"]),
  keyPoints: z.string().optional(),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => GenerateEmailInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);
    const { text } = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      prompt: `Write a ${data.tone} email to ${data.recipient}.
Purpose: ${data.purpose}
${data.keyPoints ? `Key points to include: ${data.keyPoints}` : ""}

Write only the email body. Include subject line as "Subject: ..." at the top.`,
    });

    return { text };
  });

const SummarizeNotesInput = z.object({
  notes: z.string().min(1),
  format: z.enum(["bullet_points", "paragraph", "action_items", "all"]),
});

export const summarizeNotes = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => SummarizeNotesInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);

    const formatPrompt = {
      bullet_points: "Summarize as concise bullet points.",
      paragraph: "Summarize as a short paragraph.",
      action_items: "Extract action items with owners and deadlines if mentioned.",
      all: "Provide a summary, key decisions, and action items.",
    }[data.format];

    const { text } = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      prompt: `Meeting notes to summarize:\n\n${data.notes}\n\n${formatPrompt}`,
    });

    return { text };
  });

const PlanTasksInput = z.object({
  goal: z.string().min(1),
  context: z.string().optional(),
  timeframe: z.enum(["daily", "weekly", "monthly", "project"]),
});

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => PlanTasksInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);

    const timeframeLabel = {
      daily: "a daily plan",
      weekly: "a weekly plan",
      monthly: "a monthly plan",
      project: "a project breakdown",
    }[data.timeframe];

    const { text } = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      prompt: `Create ${timeframeLabel} for this goal: ${data.goal}
${data.context ? `Context: ${data.context}` : ""}

Structure the output with clear sections, prioritized tasks, and estimated time/duration where applicable.`,
    });

    return { text };
  });

const ResearchInput = z.object({
  topic: z.string().min(1),
  depth: z.enum(["overview", "detailed", "comprehensive"]),
});

export const researchTopic = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ResearchInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);

    const depthPrompt = {
      overview: "Provide a brief overview with key facts and concepts.",
      detailed: "Provide a detailed analysis with sections, examples, and context.",
      comprehensive: "Provide a comprehensive deep dive with structured sections, pros/cons, current trends, and actionable insights.",
    }[data.depth];

    const { text } = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      prompt: `Research topic: ${data.topic}\n\n${depthPrompt}\n\nFormat with markdown headings and clear structure.`,
    });

    return { text };
  });
