import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <>
      <div>
        <Navbar />
        <HeroSection />
      </div>
    </>
  );
};

export default page;
