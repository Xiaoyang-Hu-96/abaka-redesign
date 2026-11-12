import { Hero } from "@/components/home/Hero";
import { Datasets, LogoWall, Services, Stack, Ways } from "@/components/home/sections-a";
import { Faq, FinalCta, Platform, Solutions, Why } from "@/components/home/sections-b";

export default function Home() {
  return (
    <>
      <Hero />
      <LogoWall />
      <Ways />
      <Stack />
      <Datasets />
      <Services />
      <Solutions />
      <Platform />
      <Why />
      <Faq />
      <FinalCta />
    </>
  );
}
