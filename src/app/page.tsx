import About from "@/components/About";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import Services from "@/components/Services";

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
