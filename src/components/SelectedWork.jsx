import { useEffect, useRef, useState } from "react";
import { FiArrowUpRight, FiArrowDown, FiPause, FiPlay } from "react-icons/fi";
import GalleryScene from "./GalleryScene";

const projects = [
  {
    name: "Color template",
    title: (
      <>
        Color
        <br />
        template.
      </>
    ),
    url: "https://github.com/octovir/color_template",
    theme: "chromatic",
  },
  {
    name: "Thanaport",
    title: (
      <>
        Thana
        <br />
        port.
      </>
    ),
    url: "https://github.com/octovir/thanaport",
    theme: "connected",
  },
  {
    name: "Basic calculator",
    title: (
      <>
        Basic
        <br />
        calculator.
      </>
    ),
    url: "https://github.com/octovir/basic-calculator",
    theme: "logic",
  },
];
export default function SelectedWork() {
  const section = useRef(null),
    track = useRef(null),
    progressRef = useRef(0);
  const [active, setActive] = useState(0),
    [paused, setPaused] = useState(false);
  useEffect(() => {
    let frame;
    const update = () => {
      frame = undefined;
      const node = section.current;
      const rect = node.getBoundingClientRect();
      const progress = Math.max(
        0,
        Math.min(1, -rect.top / Math.max(1, rect.height - innerHeight)),
      );
      progressRef.current = progress;
      node
        .querySelector(".gallery-canvas")
        ?.dispatchEvent(new Event("settingschange"));
      track.current.style.setProperty("--gallery-progress", progress);
      setActive(Math.min(2, Math.round(progress * 2)));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    update();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);
  function show(index) {
    const node = section.current;
    const top = node.getBoundingClientRect().top + scrollY;
    window.scrollTo({
      top: top + ((node.offsetHeight - innerHeight) * index) / 2,
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }
  return (
    <section
      className="gallery-runway"
      id="work"
      ref={section}
      aria-label="Selected work"
    >
      <span id="manifesto" className="gallery-entry" />
      <div className="gallery-stage" data-project={active}>
        <div className="gallery-heading">
          <h2>Selected work</h2>
        </div>
        <div className="gallery-floor" aria-hidden="true" />
        <GalleryScene progressRef={progressRef} paused={paused} />
        <div className="gallery-type-track" ref={track}>
          {projects.map((project, index) => (
            <article
              key={project.name}
              className={`gallery-slide gallery-${project.theme}`}
              inert={index !== active ? "" : undefined}
              aria-hidden={index !== active}
            >
              <a
                className="gallery-project-link"
                href={project.url}
                target="_blank"
                rel="noreferrer"
                aria-label={project.name}
              >
                <h3>{project.title}</h3>
                <span className="gallery-source-arrow">
                  <FiArrowUpRight />
                </span>
              </a>
            </article>
          ))}
        </div>
        <div className="gallery-bottom">
          <a
            href="#contact"
            aria-label="Continue to contact"
            className="gallery-continue"
          >
            <FiArrowDown />
          </a>
          <div className="gallery-pagination" aria-label="Choose a project">
            {projects.map((project, index) => (
              <button
                key={project.name}
                aria-label={`Show ${project.name}`}
                aria-current={active === index ? "true" : undefined}
                onClick={() => show(index)}
              >
                <i aria-hidden="true" />
              </button>
            ))}
          </div>
          <button
            className="gallery-pause"
            aria-label={
              paused ? "Resume gallery animation" : "Pause gallery animation"
            }
            aria-pressed={paused}
            onClick={() => setPaused(!paused)}
          >
            {paused ? <FiPlay /> : <FiPause />}
          </button>
        </div>
      </div>
    </section>
  );
}
