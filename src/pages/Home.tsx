import { Footer } from "../components/layout/Footer";
import { Navbar } from "../components/layout/Navbar/Navbar";
import { FaqCta } from "../components/sections/FaqCta";
import { Hero } from "../components/sections/Hero";
import { Marketplace } from "../components/sections/Marketplace";
import { Pricing } from "../components/sections/Pricing";
import { Proof } from "../components/sections/Proof";
import { Workflow } from "../components/sections/Workflow";
import { FeaturedTestimonial } from "@/components/sections/FeaturedTestimonial";

export default function Home() {
  return (
    <div id="top" className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <FeaturedTestimonial />
        <Marketplace />
        <Workflow />
        <Proof />
        <Pricing />
        <FaqCta />
      </main>
      <Footer />
    </div>
  );
}
