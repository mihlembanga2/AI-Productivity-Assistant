import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Copy, Check, Sparkles, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { summarizeNotes } from "@/lib/ai.functions";
import { ResponsibleAiDisclaimer } from "./index";

export const Route = createFileRoute("/meeting-notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — AI Workplace Assistant" },
      { name: "description", content: "Transform meeting notes into summaries and action items." },
    ],
  }),
  component: MeetingNotes,
});

function MeetingNotes() {
  const [notes, setNotes] = useState("");
  const [format, setFormat] = useState<"bullet_points" | "paragraph" | "action_items" | "all">("all");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const summarize = useServerFn(summarizeNotes);

  const handleSummarize = async () => {
    if (!notes.trim()) return;
    setIsLoading(true);
    setOutput("");
    try {
      const result = await summarize({ data: { notes, format } });
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
    setNotes("");
    setFormat("all");
  };

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Meeting Notes Summarizer</h1>
            <p className="text-sm text-muted-foreground">Transform raw notes into structured summaries and action items.</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Raw Notes</CardTitle>
              <CardDescription>Paste your meeting notes here.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notes">Meeting Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Paste or type your meeting notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={12}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="format">Output Format</Label>
                <Select value={format} onValueChange={(v) => setFormat(v as typeof format)}>
                  <SelectTrigger id="format">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Summary + Action Items</SelectItem>
                    <SelectItem value="bullet_points">Bullet Points</SelectItem>
                    <SelectItem value="paragraph">Paragraph</SelectItem>
                    <SelectItem value="action_items">Action Items Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSummarize} disabled={isLoading || !notes.trim()}>
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  Summarize
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
                <CardTitle className="text-base">Summary</CardTitle>
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
                    <FileText className="h-10 w-10 mb-3 opacity-30" />
                    <p className="text-sm">Paste notes and summarize to get started.</p>
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
