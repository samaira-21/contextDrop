"use client";
import { Button } from "@/components/ui/button";
import MDEditor from "@uiw/react-md-editor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import useProject from "@/hooks/use-project";
import Image from "next/image";
import React from "react";
import { askQuestion } from "./actions";
import CodeReferences from "./code-references";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { SaveIcon } from "lucide-react";
import useRefetch from "@/hooks/use-refetch";

const AskQuestionCard = () => {
  const { project } = useProject();
  const [question, setQuestion] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [filesReferences, setFilesReferences] = React.useState<
    { fileName: string; sourceCode: string; summary: string }[]
  >([]);
  const [answer, setAnswer] = React.useState("");
  const [answerError, setAnswerError] = React.useState<string | null>(null);
  const saveAnswer = api.project.saveAnswer.useMutation();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setAnswer("");
    setAnswerError(null);
    setFilesReferences([]);
    e.preventDefault();
    if (!project?.id) return;
    setLoading(true);
    setOpen(true);

    try {
      const { answer, filesReferences } = await askQuestion(question, project.id);
      setFilesReferences(filesReferences);
      setAnswer(answer);
      if (!answer.trim()) {
        setAnswerError("No answer was returned. Check the server logs and try again.");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setAnswerError(`I couldn't generate an answer (${message}). Please retry.`);
    } finally {
      setLoading(false);
    }
  };
  const refetch = useRefetch();

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] w-full overflow-y-auto rounded-md px-4 py-6 sm:max-w-[95vw] md:max-w-[75vw]">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <DialogTitle>
                <Image src="/logo.png" alt="dionysus" width={40} height={40} />
              </DialogTitle>
              <Button
                disabled={saveAnswer.isPending || loading || !answer.trim()}
                variant={"outline"}
                onClick={() => {
                  saveAnswer.mutate(
                    {
                      projectId: project!.id,
                      question,
                      answer,
                      filesReferences,
                    },
                    {
                      onSuccess: () => {
                        toast.success("Answer saved successfully!");
                        refetch();
                      },
                      onError: () => {
                        toast.error("Failed to save answer.");
                      },
                    },
                  );
                }}
              >
                Save Answer
                <SaveIcon className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div
            className="scrollbar-hide !h-full max-h-[40vh] max-w-[90vw] overflow-scroll rounded-md bg-white p-2 text-black"
            aria-live="polite"
          >
            {answerError ? (
              <p role="alert" className="text-sm text-red-700">
                {answerError}
              </p>
            ) : loading && !answer ? (
              <p className="text-sm text-gray-600">Generating answer…</p>
            ) : !answer.trim() ? (
              <p className="text-sm text-gray-600">
                No answer is available yet. Please try asking again.
              </p>
            ) : (
              <MDEditor.Markdown
                source={answer}
                style={{ backgroundColor: "white", color: "black" }}
                components={{
                  code: ({ children }) => (
                    <code
                      style={{
                        backgroundColor: "#015482",
                        color: "white",
                        padding: "4px 6px",
                        borderRadius: "4px",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {children}
                    </code>
                  ),
                }}
              />
            )}
          </div>
          {/* <div className="h-1"></div> */}

          <CodeReferences filesReferences={filesReferences} />

          <Button
            type="button"
            onClick={() => {
              setOpen(false);
            }}
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>

      <Card className="relative col-span-3">
        <CardHeader>
          <CardTitle>Ask a question</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <Textarea
              placeholder="Which file should I edit to change the home page?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <div className="h-4"></div>
            <Button type="submit" disabled={loading}>
              Ask Dionysus
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default AskQuestionCard;
