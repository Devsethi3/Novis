import About from "@/components/About";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import Services from "@/components/Services";
import { Button } from "@/components/ui/button";
import React from "react";

const page = () => {
  return (
    <>
      <div>
        <Navbar />
        <HeroSection />
        <About />
        <Services />
      </div>
    </>
  );
};

export default page;
