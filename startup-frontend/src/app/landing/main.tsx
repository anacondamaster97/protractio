import Navbar from "./navbar";
import  { Pricing } from "./pricing";
import { LogOutButton } from "@/components/logout-button";
import { Hero } from "./hero";
import { FeatureDemo } from "./Features";
import { EvervaultCardDemo } from "./hover";
import { CTA } from "./cta";
import { StackedCircularFooterDemo } from "./footer";
import { LogoCarouselBasic } from "./logos";

export default function LandingPage() {
  return (
    <div className="max-w-screen-xl mx-auto">
      <section>
        <Navbar />
      </section>
      <section>
        <Hero />
      </section>
      <section>
        <FeatureDemo />
      </section>
      <section>
        <LogoCarouselBasic />
      </section>
      <section>
        <EvervaultCardDemo />
      </section>
      <section className="bg-white flex justify-center items-center">
        <Pricing />
      </section>
      <section> 
        <CTA />
      </section>
      <section>
        <StackedCircularFooterDemo />
      </section>
    </div>
  );
}