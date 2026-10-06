import { useEffect, useRef, useState } from "react";
import {
  FiArrowDown,
  FiPause,
  FiPlay,
  FiRotateCcw,
  FiSliders,
  FiX,
} from "react-icons/fi";
import GlassScene from "./GlassScene";

export default function Experience() {
  const story = useRef(null),
    progressRef = useRef(0),
    bar = useRef(null),
    trigger = useRef(null),
    panel = useRef(null);
  const [chapter, setChapter] = useState(0),
    [material, setMaterial] = useState("Water"),
    [distortion, setDistortion] = useState(0.35),
    [dispersion, setDispersion] = useState(0.45),
    [paused, setPaused] = useState(false),
    [settingsOpen, setSettingsOpen] = useState(false);
  useEffect(() => {
    if (!settingsOpen) return;
    const focusFrame = requestAnimationFrame(() =>
      panel.current?.querySelector("[aria-pressed]")?.focus(),
    );
    const close = (event) => {
      if (event.key === "Escape") {
        setSettingsOpen(false);
        trigger.current?.focus();
      }
    };
    const outside = (event) => {
      if (
        !panel.current?.contains(event.target) &&
        !trigger.current?.contains(event.target)
      )
        setSettingsOpen(false);
    };
    window.addEventListener("keydown", close);
    window.addEventListener("pointerdown", outside);
    return () => {
      cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", close);
      window.removeEventListener("pointerdown", outside);
    };
  }, [settingsOpen]);
  useEffect(() => {
    let frame;
    const update = () => {
      frame = undefined;
      const rect = story.current.getBoundingClientRect();
      const progress = Math.max(
        0,
        Math.min(1, -rect.top / (rect.height - innerHeight)),
      );
      progressRef.current = progress;
      bar.current?.style.setProperty("--progress", progress);
      setChapter(progress < 0.34 ? 0 : progress < 0.72 ? 1 : 2);
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
  function goTo(index) {
    const node = story.current;
    const top = node.getBoundingClientRect().top + scrollY;
    const fraction = [0, 0.5, 0.94][index];
    window.scrollTo({
      top: top + (node.offsetHeight - innerHeight) * fraction,
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }
  function reset() {
    setMaterial("Water");
    setDistortion(0.35);
    setDispersion(0.45);
    setPaused(false);
  }
  return (
    <section
      className="experience-story"
      ref={story}
      id="home"
      aria-label="Liquid glass experience"
    >
      <span className="lab-anchor" id="lab" />
      <div className="experience-stage" data-chapter={chapter}>
        <div className="stage-surface">
          <GlassScene
            progressRef={progressRef}
            material={material}
            distortion={distortion}
            dispersion={dispersion}
            paused={paused}
          />
        </div>
        <h1 className="sr-only">
          Fluid. An interactive study of liquid glass.
        </h1>
        {settingsOpen && (
          <div
            className="material-panel liquid-panel"
            ref={panel}
            id="material-settings"
            role="region"
            aria-label="Material settings"
          >
            <div className="panel-heading">
              <span>Material</span>
              <button onClick={reset} aria-label="Reset material" title="Reset">
                <FiRotateCcw />
              </button>
              <button
                onClick={() => {
                  setSettingsOpen(false);
                  trigger.current?.focus();
                }}
                aria-label="Close material settings"
              >
                <FiX />
              </button>
            </div>
            <div
              className="material-switch"
              role="group"
              aria-label="Choose glass material"
            >
              {["Water", "Frost", "Chrome"].map((item, index) => (
                <button
                  key={item}
                  onClick={() => setMaterial(item)}
                  aria-pressed={material === item}
                >
                  <i className={`material-sample sample-${index}`} />
                  {item}
                </button>
              ))}
            </div>
            <label className="material-range">
              Distortion <output>{Math.round(distortion * 100)}%</output>
              <input
                aria-label="Distortion"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={distortion}
                onChange={(e) => setDistortion(Number(e.target.value))}
              />
            </label>
            <label className="material-range">
              Dispersion <output>{Math.round(dispersion * 100)}%</output>
              <input
                aria-label="Dispersion"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={dispersion}
                onChange={(e) => setDispersion(Number(e.target.value))}
              />
            </label>
          </div>
        )}
        <div className="stage-bottom" ref={bar}>
          <button
            className="scroll-invitation"
            onClick={() =>
              chapter < 2
                ? goTo(chapter + 1)
                : document.getElementById("manifesto").scrollIntoView({
                    behavior: matchMedia("(prefers-reduced-motion: reduce)")
                      .matches
                      ? "instant"
                      : "smooth",
                  })
            }
            aria-label="Continue exploring"
          >
            Scroll <FiArrowDown />
          </button>
          <div className="chapter-track" aria-label="Experience chapters">
            {["Form", "Motion", "Play"].map((name, i) => (
              <button
                key={name}
                onClick={() => goTo(i)}
                aria-label={`Go to ${name} chapter`}
                title={name}
                aria-current={chapter === i ? "step" : undefined}
              >
                <i />
              </button>
            ))}
            <div className="chapter-progress">
              <i />
            </div>
          </div>
          <div className="material-dock liquid-panel">
            <button
              ref={trigger}
              className="material-trigger"
              onClick={() => setSettingsOpen(!settingsOpen)}
              aria-label="Customize material"
              aria-expanded={settingsOpen}
              aria-controls="material-settings"
            >
              <FiSliders />
              <span>Material</span>
            </button>
            <button
              className="pause-control"
              onClick={() => setPaused(!paused)}
              aria-label={paused ? "Resume animation" : "Pause animation"}
              aria-pressed={paused}
              title={paused ? "Resume" : "Pause"}
            >
              {paused ? <FiPlay /> : <FiPause />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
