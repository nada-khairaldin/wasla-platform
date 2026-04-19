"use client";
import Hero from "@/src/components/sections/landing/Hero";
import FeaturesSection from "../../components/sections/landing/FeaturesSection";
import StepsSection from "../../components/sections/landing/StepsSection";
import ChallengeAndSolutionSection from "../../components/sections/landing/ChallengeAndSolutionSection";
import HelpSection from "../../components/sections/landing/HelpSection";
import SuccessGrid from "../../components/sections/landing/SuccessGrid";
import SuccessStoriesSection from "../../components/sections/landing/SuccessStoriesSection";
import StatsSection from "../../components/sections/landing/StatsSection";

function Page() {
  return (
    <div className=" mt-sm">
      <Hero />
      <ChallengeAndSolutionSection />
      <StepsSection />
      <FeaturesSection />
      <HelpSection />
      <StatsSection />
      <SuccessGrid />
      <SuccessStoriesSection />
    </div>
  );
}

export default Page;
