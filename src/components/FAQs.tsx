"use client";

import clsx from "clsx";
import React, { useState } from "react";
import { LuPlus } from "react-icons/lu";
import { LuMinus } from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";

const items = [
  {
    question: "How can AI enhance my productivity?",
    answer:
      "Our platform uses AI to assist with note-taking, task management, and workflow automation, reducing the time you spend on repetitive tasks and helping you stay focused on what matters most.",
  },
  {
    question: "What features does the platform offer?",
    answer:
      "We offer real-time collaboration, AI-powered note-taking, task tracking, workflow automation, and seamless integrations with other tools you already use. Our workspace adapts to your needs, whether you're working solo or with a team.",
  },
  {
    question: "How does AI-powered note-taking work?",
    answer:
      "AI-powered note-taking automatically organizes your notes, highlights important information, and suggests relevant content. It helps you stay on top of your ideas and ensures nothing important gets lost.",
  },
  {
    question: "Is the platform suitable for teams?",
    answer:
      "Yes, our platform is designed to foster collaboration. Teams can work together in real-time, share ideas, and stay organized with task assignments, project boards, and instant updates.",
  },
  {
    question: "How secure is my data?",
    answer:
      "We take security seriously. All data is encrypted and securely stored, ensuring your information remains safe and private. We also provide regular updates and backups to safeguard your work.",
  },
  {
    question: "Can I integrate the platform with other tools?",
    answer:
      "Yes, we offer seamless integrations with popular tools like Slack, Google Workspace, and Trello, so you can keep using the software you love while benefiting from our AI-enhanced productivity features.",
  },
];

const AccordionItem = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div
        className="py-7 border-b cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <span className="flex-1 lg:text-2xl text-xl font-medium">
            {question}
          </span>
          {isOpen ? <LuMinus /> : <LuPlus />}
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              className={clsx("mt-4 text-lg lg:text-xl", {
                hidden: !isOpen,
                "": isOpen === true,
              })}
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: "16px" }}
              exit={{
                opacity: 0,
                height: 0,
                marginTop: 0,
              }}
            >
              {answer}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

const FAQs = () => {
  return (
    <div id="faq">
      <div className="pb-32 dark:bg-gradient-to-t dark:from-[#09100D] dark:to-emerald-400/5 from-[#F9FBFA] to-emerald-400/30 bg-gradient-to-t overflow-hidden min-h-screen relative">
        <div className="container">
          <h2 className="text-center text-4xl lg:text-5xl font-bold">
            Frequently Asked Question
          </h2>

          <div className="mt-12 max-w-[948px] mx-auto">
            {items.map(({ question, answer }) => (
              <AccordionItem
                question={question}
                answer={answer}
                key={question}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQs;
