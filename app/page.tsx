import { Hero } from "@/components/Hero";
import { SelectedWork } from "@/components/SelectedWork";
import { Experience } from "@/components/Experience";
import { HowIWork } from "@/components/HowIWork";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <SelectedWork />
      <Experience />
      <HowIWork />
      <About />
      <Contact />
    </>
  );
}
