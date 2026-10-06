import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Experience from "../components/Experience";
import SelectedWork from "../components/SelectedWork";
import ContactSection from "../components/ContactSection";

export default function Home() {
  useEffect(() => {
    const destination =
      window.location.hash ||
      { "/contact": "#contact", "/github": "#work" }[window.location.pathname];
    if (destination)
      requestAnimationFrame(() =>
        document
          .getElementById(destination.slice(1))
          ?.scrollIntoView({ behavior: "instant" }),
      );
  }, []);
  return (
    <>
      <svg className="filter-definitions" aria-hidden="true">
        <defs>
          <filter
            id="liquid-refraction"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012 0.025"
              numOctaves="2"
              seed="7"
              result="noise"
            />
            <feGaussianBlur in="noise" stdDeviation="2" result="softNoise" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="softNoise"
              scale="15"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      <a className="skip-link" href="#work">
        Skip experience and see work
      </a>
      <Navbar />
      <main id="main">
        <Experience />
        <SelectedWork />
        <ContactSection />
      </main>
    </>
  );
}
