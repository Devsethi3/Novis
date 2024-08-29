"use client";

import React, { useRef, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useAnimation,
} from "framer-motion";
import Image from "next/image";

const About: React.FC = () => {
  const aboutRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const controls = useAnimation();

  const { scrollYProgress } = useScroll({
    target: aboutRef,
    offset: ["start end", "end end"],
  });

  const translateY = useTransform(scrollYProgress, [0, 1], [200, -100]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const titleY = useTransform(scrollYProgress, [0, 0.2], [50, 0]);

  const isInView = useInView(paragraphRef, { once: false, amount: 0.3 });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, isInView]);

  const paragraphVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const features = [
    {
      title: "AI-Powered Notes",
      icon: "🧠",
      description:
        "Harness the power of AI to organize and enhance your notes seamlessly.",
    },
    {
      title: "Real-Time Collaboration",
      icon: "🤝",
      description:
        "Collaborate effortlessly with your team, with real-time updates and synchronization.",
    },
    {
      title: "Customizable Workspaces",
      icon: "🛠️",
      description:
        "Tailor your workspace to fit your workflow with customizable features and layouts.",
    },
  ];

  return (
    <motion.section
      ref={aboutRef}
      initial="hidden"
      id="about"
      className="pt-6 dark:bg-[#09100D] bg-white overflow-hidden min-h-screen relative"
    >
      <div
        className="w-[300px]
          blur-[120px]
          rounded-full
          h-32
          absolute
          bg-purple-500/20
          -z-10
          top-22
        "
      />
      <div className="container mx-auto px-4">
        <motion.h1
          ref={titleRef}
          style={{ opacity: titleOpacity, y: titleY }}
          className="text-4xl sm:text-7xl md:text-7xl font-bold mb-12 text-center relative"
        >
          Elevate <motion.span className="text-primary">Your</motion.span>{" "}
          Productivity with AI
        </motion.h1>

        <motion.div className="text-center mb-20">
          <p className="text-lg sm:text-2xl md:text-3xl mb-8 max-w-6xl mx-auto">
            Transform the way you take notes, organize tasks, and collaborate.
            Our AI-powered platform adapts to your workflow, helping you stay
            focused and get more done.
          </p>
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 15px rgba(26, 255, 156, 0.795)",
            }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r bg-primary to-emerald-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300"
          >
            ✨ Explore the Features
          </motion.button>
        </motion.div>

        <motion.div
          style={{ translateY }}
          className="absolute top-[20%] z-20 left-9 rotate-45 hidden lg:block"
        >
          <Image
            src="/rhombus.avif"
            width={200}
            height={200}
            alt="rhombus"
            className="hero-object"
          />
        </motion.div>
        <motion.div
          style={{ translateY }}
          className="absolute top-[40%] z-20 right-9 rotate-45 hidden lg:block"
        >
          <Image
            src="/cube-1.avif"
            width={200}
            height={200}
            alt="cube"
            className="hero-object"
          />
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
          id="features"
          className="grid md:grid-cols-3 relative gap-12 mb-20"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.6,
                    ease: "easeOut",
                  },
                },
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 20px rgba(5, 255, 138, 0.3)",
              }}
              className="bg-gradient-to-br from-[#60ebc8]/10 to-[#1e1e2d]/10 p-8 rounded-2xl backdrop-blur-md shadow-xl transition-all duration-300 relative"
            >
              <div className="absolute z-10 top-[-13%] shadow-xl shadow-black left-[40%] bg-primary text-white rounded-full text-2xl font-medium w-16 h-16 grid place-items-center">
                {index + 1}
              </div>
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-lg">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          ref={paragraphRef}
          variants={paragraphVariants}
          initial="hidden"
          animate={controls}
          className="mt-16 text-xl lg:text-4xl"
        >
          ✦ Welcome to our platform, where ideas become actionable insights.
          <br />
          <br />
          <strong>What We Do:</strong> We help you streamline your workflow
          through AI-enhanced note-taking and task management, making your
          productivity effortless.
          <br />
          <br />
          <strong>Our Approach:</strong> We provide an intuitive workspace where
          collaboration, creativity, and organization meet. With real-time
          updates and AI-powered assistance, your ideas come to life faster than
          ever.
          <br />
          <br />
          <strong>Maximize Your Potential:</strong> Our innovative platform
          empowers you to focus on what matters most—turning your ideas into
          results.
        </motion.p>
      </div>
    </motion.section>
  );
};

export default About;
