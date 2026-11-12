import { Hero } from "@/components/home/Hero";
import { Datasets, LogoWall, Services, Stack, Ways } from "@/components/home/sections-a";
import { Faq, FinalCta, Platform, Solutions, Why } from "@/components/home/sections-b";
import { SectionIntro } from "@/components/ui/Grid";
import { sectionIntros } from "@/lib/content";

const intro = (i: number) => <SectionIntro n={i + 1} total={sectionIntros.length} label={sectionIntros[i]} />;

export default function Home() {
  return (
    <>
      <Hero />
      <LogoWall />
      {intro(0)}
      <Ways />
      {intro(1)}
      <Stack />
      {intro(2)}
      <Datasets />
      {intro(3)}
      <Services />
      {intro(4)}
      <Solutions />
      {intro(5)}
      <Platform />
      {intro(6)}
      <Why />
      {intro(7)}
      <Faq />
      {intro(8)}
      <FinalCta />
    </>
  );
}
