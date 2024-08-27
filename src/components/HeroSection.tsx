"use client";

import React from "react";
import { motion } from "framer-motion";
import { FiEdit3, FiClock, FiCloud } from "react-icons/fi";

const HeroSection = () => {
  return (
    <div className="bg-gradient-to-b from-primary/10 to-background py-36 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-primary mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Elevate Your Note-Making
          <br />
          <span className="text-primary">with AI-Powered Insights</span>
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Experience the future of note-taking with our AI-driven platform.
          Create, organize, and enhance your ideas in real-time.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <a
            href="#get-started"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-8 rounded-full text-lg transition duration-300 inline-block"
          >
            Get Started
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
      >
        <FeatureCard
          icon={<FiEdit3 className="w-8 h-8 text-primary" />}
          title="Smart Editing"
          description="AI-powered suggestions and auto-completion for faster note-taking."
        />
        <FeatureCard
          icon={<FiClock className="w-8 h-8 text-primary" />}
          title="Real-Time Sync"
          description="Seamlessly sync your notes across all devices in real-time."
        />
        <FeatureCard
          icon={<FiCloud className="w-8 h-8 text-primary" />}
          title="Cloud Storage"
          description="Securely store and access your notes from anywhere, anytime."
        />
      </motion.div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <motion.div
    className="bg-card text-card-foreground rounded-lg p-6 shadow-lg hover:shadow-xl transition duration-300"
    whileHover={{ y: -5 }}
  >
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </motion.div>
);

export default HeroSection;
