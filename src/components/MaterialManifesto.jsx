import { useEffect, useRef } from "react";
import { FiArrowUpRight } from "react-icons/fi";

export default function MaterialManifesto() {
  const section = useRef(null);
  const lens = useRef(null);
  useEffect(() => {
    const node = section.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        node.classList.toggle("in-view", entry.isIntersecting);
      },
      { threshold: 0.15 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  function move(event) {
    if (
      event.pointerType === "touch" ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const bounds = section.current.getBoundingClientRect();
    lens.current.style.setProperty(
      "--lens-x",
      `${event.clientX - bounds.left}px`,
    );
    lens.current.style.setProperty(
      "--lens-y",
      `${event.clientY - bounds.top}px`,
    );
  }
  return (
    <section
      className="manifesto"
      id="manifesto"
      ref={section}
      onPointerMove={move}
    >
      <h2>
        Less, but
        <br />
        <span>more alive.</span>
      </h2>
      <a
        href="#lab"
        className="round-link"
        aria-label="Return to the material lab"
      >
        <FiArrowUpRight />
      </a>
      <div className="cursor-lens liquid-panel" ref={lens} aria-hidden="true" />
    </section>
  );
}
