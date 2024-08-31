import About from "@/components/About";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";

const page = () => {
  return (
    <>
      <div>
        <Navbar />
        <HeroSection />
        <About />
      </div>
    </>
  );
};

export default page;
