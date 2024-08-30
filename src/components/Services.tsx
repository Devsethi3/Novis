"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { FaBrain, FaUsers, FaLock, FaRocket } from "react-icons/fa";

const ServiceCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}> = ({ title, description, icon, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0.8, 1, 1, 0.8]
  );

  return (
    <motion.div
      ref={cardRef}
      style={{ y, opacity, scale }}
      className="bg-gradient-to-br from-primary/10 to-secondary/10 p-8 rounded-2xl backdrop-blur-sm shadow-xl transition-all duration-300 border border-primary/20"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: index * 0.2, type: "spring", stiffness: 100 }}
        className="text-4xl mb-4 text-primary"
      >
        {icon}
      </motion.div>
      <h3 className="text-2xl font-semibold mb-4">{title}</h3>
      <p className="text-foreground/80">{description}</p>
    </motion.div>
  );
};

const Services: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const scaleX = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1]), {
    stiffness: 100,
    damping: 30,
  });

  const services = [
    {
      title: "AI-Powered Insights",
      description:
        "Leverage cutting-edge AI to extract key insights from your notes and enhance your productivity.",
      icon: <FaBrain />,
    },
    {
      title: "Collaborative Workspaces",
      description:
        "Seamlessly collaborate with your team in real-time, fostering creativity and boosting efficiency.",
      icon: <FaUsers />,
    },
    {
      title: "Advanced Security",
      description:
        "Keep your ideas safe with state-of-the-art encryption and customizable privacy settings.",
      icon: <FaLock />,
    },
    {
      title: "Performance Optimization",
      description:
        "Supercharge your workflow with blazing-fast performance and intuitive optimizations.",
      icon: <FaRocket />,
    },
  ];

  return (
    <section
      ref={containerRef}
      className="py-20 dark:bg-[#09100D] bg-gray-50 overflow-hidden min-h-screen relative"
    >
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-12 text-center"
        >
          Our{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
            Services
          </span>
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {services.map((service, index) => (
            <ServiceCard key={service.title} {...service} index={index} />
          ))}
        </div>

        <div className="relative pt-16">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary/20 rounded-full" />
          <motion.div
            style={{ scaleX, transformOrigin: "left" }}
            className="absolute top-0 left-0 w-full h-1 bg-primary rounded-full"
          />
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-xl md:text-2xl text-center max-w-4xl mx-auto"
          >
            Experience the future of note-taking and collaboration with our
            innovative AI-powered platform. Unlock your full potential and
            transform the way you work, create, and achieve.
          </motion.p>
        </div>
      </div>

      <motion.div
        style={{
          x: useTransform(scrollYProgress, [0, 1], ["-100%", "100%"]),
          y: useTransform(scrollYProgress, [0, 1], ["100%", "-100%"]),
        }}
        className="absolute -bottom-20 -left-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl"
      />
      <motion.div
        style={{
          x: useTransform(scrollYProgress, [0, 1], ["100%", "-100%"]),
          y: useTransform(scrollYProgress, [0, 1], ["-100%", "100%"]),
        }}
        className="absolute -top-20 -right-20 w-40 h-40 bg-secondary/20 rounded-full blur-3xl"
      />
    </section>
  );
};

export default Services;
