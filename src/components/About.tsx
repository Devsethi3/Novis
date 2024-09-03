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
    offset: ["start end", "end start"],
  });

  const translateY = useTransform(scrollYProgress, [0, 1], [100, -50]);
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
      className="pt-20 pb-32 dark:bg-gradient-to-b dark:from-[#09100D] dark:to-emerald-400/5 from-[#F9FBFA] to-emerald-400/30 bg-gradient-to-b overflow-hidden min-h-screen relative"
    >
      <div
        className="w-[300px]
          blur-[120px]
          rounded-full
          h-32
          absolute
          bg-primary/20
          -z-10
          top-22
          left-1/2
          transform
          -translate-x-1/2
        "
      />
      <div className="container mx-auto px-4">
        <motion.h2
          ref={titleRef}
          style={{ opacity: titleOpacity, y: titleY }}
          className="text-4xl sm:text-6xl md:text-7xl font-bold mb-12 text-center relative"
        >
          Increase{" "}
          <motion.span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
            Your
          </motion.span>{" "}
          Productivity
        </motion.h2>

        <motion.div className="text-center mb-20">
          <p className="text-lg sm:text-xl md:text-2xl mb-12 max-w-4xl mx-auto text-foreground/80">
            Transform the way you take notes, organize tasks, and collaborate.
            Our AI-powered platform adapts to your workflow
          </p>
        </motion.div>

        <motion.div
          style={{ y: translateY }}
          className="absolute top-[20%] z-20 left-9 rotate-12 hidden lg:block"
        >
          <Image
            src="/rhombus.avif"
            width={150}
            height={150}
            alt="rhombus"
            className="hero-object opacity-60"
          />
        </motion.div>
        <motion.div
          style={{ y: translateY }}
          className="absolute top-[40%] z-20 right-9 -rotate-12 hidden lg:block"
        >
          <Image
            src="/cube-1.avif"
            width={150}
            height={150}
            alt="cube"
            className="hero-object opacity-60"
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 relative lg:gap-8 gap-16 mb-32"
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
                scale: 1.03,
                boxShadow: "0 0 20px hsl(var(--primary) / 0.2)",
              }}
              className="bg-gradient-to-br from-primary/5 to-secondary/5 p-8 rounded-2xl backdrop-blur-sm shadow-xl transition-all duration-300 relative border border-primary/10"
            >
              <div className="absolute z-10 top-[-10%] shadow-lg left-[40%] bg-primary text-primary-foreground rounded-full text-2xl font-medium w-14 h-14 grid place-items-center">
                {index + 1}
              </div>
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-lg text-foreground/80">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* <motion.div
          ref={paragraphRef}
          variants={paragraphVariants}
          initial="hidden"
          animate={controls}
          className="mt-16 text-xl lg:text-3xl max-w-6xl mx-auto"
        >
          <h3 className="text-3xl font-bold mb-8 text-center">Our Vision</h3>
          <p className="mb-6">
            ✦ Welcome to our platform, where ideas become actionable insights.
          </p>
          <p className="mb-6">
            <strong>What We Do:</strong> We help you streamline your workflow
            through AI-enhanced note-taking and task management, making your
            productivity effortless.
          </p>
          <p className="mb-6">
            <strong>Our Approach:</strong> We provide an intuitive workspace
            where collaboration, creativity, and organization meet. With
            real-time updates and AI-powered assistance, your ideas come to life
            faster than ever.
          </p>
          <p>
            <strong>Maximize Your Potential:</strong> Our innovative platform
            empowers you to focus on what matters most—turning your ideas into
            results.
          </p>
        </motion.div> */}
      </div>
    </motion.section>
  );
};

export default About;
