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
import { SiGooglegemini } from "react-icons/si";
import GradientText from "@/components/GradientText";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { chatSession } from "@/lib/AiModel";

const GenerateAIContent = () => {
  const [userInput, setUserInput] = useState<string>();
  const [loading, setLoading] = useState(false);

  const GenerateFromAI = async () => {
    setLoading(true);

    const PROMPT = "Generate template for editor.js in JSON for" + userInput;
    const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
    console.log(result.response.text());
  };
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <button>
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
              Prompt below to generate content for your notes.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Label htmlFor="notePrompt" className="text-sm opacity-80">
              Prompt
            </Label>
            <Input
              id="notePrompt"
              onChange={(e) => setUserInput(e?.target.value)}
              className="col-span-3 p-2 border rounded-md"
              placeholder="e.g., Outline the key points for a marketing strategy"
            />
          </div>
          <DialogFooter>
            <Button variant="secondary">Cancel</Button>
            <Button
              type="submit"
              disabled={!userInput || loading}
              onClick={() => GenerateFromAI()}
            >
              Generate Content
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GenerateAIContent;
