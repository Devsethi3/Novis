"use client";

import Image from "next/image";
import React from "react";
import { GoArrowRight } from "react-icons/go";
import { motion, useScroll, useTransform } from "framer-motion";
import useAuth from "@/lib/useAuth";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const Hero = () => {
  const { scrollY } = useScroll();
  const { currentUser } = useAuth();
  const router = useRouter();

  const chatY = useTransform(scrollY, [0, 300], [0, -100]);
  const chatRotate = useTransform(scrollY, [0, 300], [0, -15]);
  const cursorY = useTransform(scrollY, [0, 300], [0, -150]);
  const cursorRotate = useTransform(scrollY, [0, 300], [0, 15]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const gradientAnimation = {
    background: [
      "linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--primary)/0.2) 50%, hsl(var(--secondary)/0.2) 100%)",
      "linear-gradient(225deg, hsl(var(--background)) 0%, hsl(var(--secondary)/0.2) 50%, hsl(var(--primary)/0.2) 100%)",
    ],
    transition: {
      duration: 10,
      repeat: Infinity,
      repeatType: "reverse",
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
        delay: 0.5,
      },
    },
  };

  return (
    <motion.div
      className="relative overflow-hidden min-h-screen flex justify-center items-center text-foreground py-20"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        className="absolute inset-0 z-[-1]"
        //@ts-expect-error
        animate={gradientAnimation}
      />
      <div className="absolute h-[375px] w-[750px] sm:w-[3836px] sm:h-[768px] rounded-[100%] bg-background/80 left-1/2 -translate-x-1/2 border-primary/20 bg-[radial-gradient(closest-side,hsl(var(--background))_82%,hsl(var(--primary)/0.3))] top-[calc(100%-96px)] sm:top-[calc(100%-120px)]"></div>

      <div className="container mx-auto px-4 relative">
        <motion.div
          className="absolute top-[20%] z-20 right-9"
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <Image
            src="/star.avif"
            width={50}
            height={50}
            alt="star"
            className="hero-object"
          />
        </motion.div>
        <motion.div
          className="flex items-center justify-center lg:mt-16 mt-12"
          variants={itemVariants}
        >
          <motion.a
            href="#"
            className="border inline-flex gap-3 text-sm lg:text-base py-2 px-4 rounded-full border-primary/50 bg-primary/10 backdrop-blur-sm"
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 0px 15px hsl(var(--primary) / 0.5)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 text-transparent bg-clip-text font-semibold">
              Discover Our Expertise
            </span>
            <span className="inline-flex items-center gap-2 text-foreground/80">
              <span>Read More</span>
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <GoArrowRight />
              </motion.span>
            </span>
          </motion.a>
        </motion.div>
        <motion.div
          className="flex justify-center lg:mt-12 mt-10"
          variants={itemVariants}
        >
          <div className="inline-flex relative">
            <motion.h1
              className="text-3xl sm:text-6xl lg:text-7xl font-bold text-center leading-tight"
              variants={titleVariants}
            >
              Boost Your Notes with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
                AI-Powered
              </span>{" "}
              {/* <br /> */}
              Insights Tailored for Success
            </motion.h1>
            <motion.div
              className="absolute right-[-50px] top-[188px] hidden sm:inline cursor-grab"
              style={{ y: chatY, rotate: chatRotate }}
              drag
              dragSnapToOrigin
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Image
                src="/chat.avif"
                alt="chat"
                height={200}
                width={200}
                className="max-w-none hero-object"
                draggable="false"
              />
            </motion.div>
            <motion.div
              className="absolute top-[70px] left-[-80px] hidden sm:inline cursor-grab"
              style={{ y: cursorY, rotate: cursorRotate }}
              drag
              dragSnapToOrigin
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Image
                src="/cursor.avif"
                alt="cursor"
                height={200}
                width={200}
                className="max-w-none hero-object"
                draggable="false"
              />
            </motion.div>
          </div>
        </motion.div>
        <motion.div className="flex justify-center" variants={itemVariants}>
          <motion.p
            className="text-center text-lg md:text-xl lg:text-2xl mt-8 max-w-3xl text-foreground/80"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            Elevate your note-taking experience with our AI-enhanced platform.
            Capture ideas effortlessly, streamline tasks intelligently.{" "}
          </motion.p>
        </motion.div>
        <motion.div
          className="flex justify-center mt-12"
          variants={itemVariants}
        >
          {currentUser && (
            <motion.button
              onClick={() => router.push("/dashboard")}
              className="bg-primary text-primary-foreground lg:py-4 py-3 lg:px-8 px-5 rounded-xl flex items-center lg:text-lg text-sm font-semibold shadow-lg"
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 0px 20px hsl(var(--primary) / 0.7)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              Start Your Journey
              <motion.svg
                className="ml-2 w-6 h-6"
                viewBox="0 0 24 24"
                initial={{ x: 0 }}
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <path
                  fill="currentColor"
                  d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"
                />
              </motion.svg>
            </motion.button>
          )}
          {!currentUser && (
            <motion.button
              onClick={() => router.push("/login")}
              className="bg-primary text-primary-foreground lg:py-4 py-3 lg:px-8 px-5 rounded-xl flex items-center lg:text-lg text-sm font-semibold shadow-lg"
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 0px 20px hsl(var(--primary) / 0.7)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              Start Your Journey
              <motion.svg
                className="ml-2 w-6 h-6"
                viewBox="0 0 24 24"
                initial={{ x: 0 }}
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <path
                  fill="currentColor"
                  d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"
                />
              </motion.svg>
            </motion.button>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Hero;
