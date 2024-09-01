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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { chatSession } from "@/lib/AiModel";
import { toast } from "react-hot-toast";
import { ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import GradientText from "@/components/GradientText";

interface GenerateAIContentProps {
  onContentGenerated?: (content: any) => void;
}

const GenerateAIContent: React.FC<GenerateAIContentProps> = ({
  onContentGenerated,
}) => {
  const [userInput, setUserInput] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const generateFromAI = async () => {
    if (!userInput.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setLoading(true);
    try {
      const prompt = `Generate template for editor.js in JSON format for: ${userInput}`;
      const result = await chatSession.sendMessage(prompt);
      const responseText = await result.response.text();

      if (
        !responseText.trim().startsWith("{") &&
        !responseText.trim().startsWith("[")
      ) {
        throw new Error("AI response is not in valid JSON format");
      }

      const parsedContent = JSON.parse(responseText);
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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      generateFromAI();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <GradientText
          onClick={() => setOpen(true)}
          colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]} // Custom gradient colors
          animationSpeed={3} // Custom animation speed in seconds
          showBorder={true} // Show or hide border
          className="custom-class px-3.5 py-2.5" // Add one or more custom classes
        >
          ✨ Generate with AI
        </GradientText>
        {/* <Button onClick={() => setOpen(true)}>Generate with AI</Button> */}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            AI Content Generator
          </DialogTitle>
          <DialogDescription className="text-sm text-center mt-2">
            Enhance your notes with AI-generated content. Simply enter a prompt
            describing what you'd like to create, and our AI will generate
            structured content for your editor.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 mt-4">
          <Label htmlFor="notePrompt" className="text-sm font-medium">
            Your Prompt
          </Label>
          <Input
            id="notePrompt"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="col-span-3 p-2 border rounded-md"
            placeholder="e.g., Outline the key points for a marketing strategy"
          />
        </div>
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!userInput.trim() || loading}
            onClick={generateFromAI}
            className="ml-2"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "✨ Generate Content"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateAIContent;
