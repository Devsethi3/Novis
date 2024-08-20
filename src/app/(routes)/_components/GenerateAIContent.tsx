"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import GradientText from "@/components/GradientText";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { chatSession } from "@/lib/AiModel";
import { toast } from "react-hot-toast";

interface GenerateAIContentProps {
  onContentGenerated?: (content: any) => void;
}

const GenerateAIContent: React.FC<GenerateAIContentProps> = ({
  onContentGenerated,
}) => {
  const [userInput, setUserInput] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);

  const generateFromAI = async () => {
    setLoading(true);
    try {
      const prompt = `Generate template for editor.js in JSON format for: ${userInput}`;
      const result = await chatSession.sendMessage(prompt);
      const responseText = await result.response.text();

      let parsedContent;
      try {
        parsedContent = JSON.parse(responseText);
      } catch (error) {
        console.error("Failed to parse AI response as JSON:", error);
        toast.error("Failed to parse AI response. Please try again.");
        return;
      }

      setGeneratedContent(parsedContent);
      console.log(parsedContent);

      if (onContentGenerated) {
        onContentGenerated(parsedContent);
      }
      setOpen(false);
      toast.success("Content generated successfully!");
    } catch (error) {
      console.error("Error generating AI content:", error);
      toast.error("Failed to generate content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button onClick={() => setOpen(true)}>
          <GradientText
            animationSpeed={5}
            showBorder={true}
            className="custom-class"
          >
            Generate with AI
          </GradientText>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            Generate AI Content
          </DialogTitle>
          <DialogDescription className="text-sm">
            Enter a prompt below to generate content for your notes.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Label htmlFor="notePrompt" className="text-sm opacity-80">
            Prompt
          </Label>
          <Input
            id="notePrompt"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="col-span-3 p-2 border rounded-md"
            placeholder="e.g., Outline the key points for a marketing strategy"
          />
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!userInput || loading}
            onClick={generateFromAI}
          >
            {loading ? "Generating..." : "Generate Content"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateAIContent;
