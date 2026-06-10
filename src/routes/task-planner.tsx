import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { CheckSquare, Copy, Check, Sparkles, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { planTasks } from "@/lib/ai.functions";
import { ResponsibleAiDisclaimer } from "./index";

export const Route = createFileRoute("/task-planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — AI Workplace Assistant" },
      { name: "description", content: "Generate structured task plans with AI." },
    ],
  }),
  component: TaskPlanner,
});

function TaskPlanner() {
  const [goal, setGoal] = useState("");
  const [context, setContext] = useState("");
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly" | "project">("weekly");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const plan = useServerFn(planTasks);

  const handlePlan = async () => {
    if (!goal.trim()) return;
    setIsLoading(true);
    setOutput("");
    try {
      const result = await plan({ data: { goal, timeframe, context: context || undefined } });
      setOutput(result.text);
    } catch (e) {
      setOutput("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setOutput("");
    setGoal("");
    setContext("");
    setTimeframe("weekly");
  };

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
            <CheckSquare className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">AI Task Planner</h1>
            <p className="text-sm text-muted-foreground">Generate structured plans with priorities, timelines, and milestones.</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Plan Details</CardTitle>
              <CardDescription>Define your goal and context.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="goal">Goal</Label>
                <Input
                  id="goal"
                  placeholder="e.g. Launch new product feature"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="context">Context (optional)</Label>
                <Textarea
                  id="context"
                  placeholder="Team size, constraints, resources..."
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeframe">Timeframe</Label>
                <Select value={timeframe} onValueChange={(v) => setTimeframe(v as typeof timeframe)}>
                  <SelectTrigger id="timeframe">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily Plan</SelectItem>
                    <SelectItem value="weekly">Weekly Plan</SelectItem>
                    <SelectItem value="monthly">Monthly Plan</SelectItem>
                    <SelectItem value="project">Project Breakdown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button onClick={handlePlan} disabled={isLoading || !goal.trim()}>
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  Generate Plan
                </Button>
                <Button variant="outline" onClick={handleClear} disabled={isLoading}>
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Generated Plan</CardTitle>
                <CardDescription>Edit directly in the box below.</CardDescription>
              </div>
              {output && (
                <Button variant="ghost" size="icon" onClick={handleCopy}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                {output ? (
                  <motion.div
                    key="output"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Textarea
                      value={output}
                      onChange={(e) => setOutput(e.target.value)}
                      rows={16}
                      className="text-sm resize-none leading-relaxed"
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground"
                  >
                    <CheckSquare className="h-10 w-10 mb-3 opacity-30" />
                    <p className="text-sm">Enter a goal and generate your plan.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>

        <ResponsibleAiDisclaimer className="mt-6" />
      </motion.div>
    </div>
  );
}
