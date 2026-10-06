import { useEffect, useRef, useState } from "react";
import { FiArrowUpRight, FiMenu, FiX } from "react-icons/fi";
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const menuButton = useRef(null);
  useEffect(() => {
    const close = (e) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);
  return (
    <header className="site-header">
      <a className="wordmark" href="/#home" aria-label="Thanakrit home">
        t<span>.</span>
      </a>
      <nav
        className={`navigation liquid-panel ${open ? "is-open" : ""}`}
        aria-label="Main navigation"
      >
        <button
          ref={menuButton}
          className="menu-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="navigation-links"
          onClick={() => setOpen(!open)}
        >
          {open ? <FiX /> : <FiMenu />}
        </button>
        <div className="nav-links" id="navigation-links">
          <a href="/#home" onClick={() => setOpen(false)}>
            Experience
          </a>
          <a href="/#work" onClick={() => setOpen(false)}>
            Work
          </a>
          <a href="/#about" onClick={() => setOpen(false)}>
            About
          </a>
        </div>
      </nav>
      <a className="header-contact" href="/#contact">
        Contact <FiArrowUpRight />
      </a>
    </header>
  );
}
