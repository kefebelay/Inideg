import AboutContactSection from "@/components/user/About&Contact";
import Section1 from "@/components/user/Section1";
import Section2 from "@/components/user/Section2";
import Section3 from "@/components/user/Section3";
import Section4 from "@/components/user/Section4";
import React from "react";

export default function page() {
  return (
    <div>
      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 />
      <AboutContactSection />
    </div>
  );
}
