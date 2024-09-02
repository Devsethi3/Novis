import About from "@/components/About";
import FAQs from "@/components/FAQs";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";

const page = () => {
  return (
    <>
      <div>
        <Navbar />
        <HeroSection />
        <About />
        <FAQs />
      </div>
    </>
  );
};

export default page;
