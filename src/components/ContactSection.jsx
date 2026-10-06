import { useEffect, useRef, useState } from "react";
import { FiArrowUpRight, FiArrowRight, FiArrowUp, FiX } from "react-icons/fi";

export default function ContactSection() {
  const [state, setState] = useState("idle");
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const dialog = useRef(null),
    invitation = useRef(null),
    closing = useRef(null),
    submitting = useRef(false),
    surfaceAnimation = useRef(null);
  useEffect(() => {
    if (!open) return;
    const node = dialog.current;
    const trigger = invitation.current;
    const previousOverflow = document.body.style.overflow;
    node.dataset.phase = "enter";
    node.showModal();
    const source = trigger
      .querySelector(".closing-glass")
      .getBoundingClientRect();
    const target = node.getBoundingClientRect();
    const x = Math.max(
      -180,
      Math.min(
        180,
        source.left + source.width / 2 - target.left - target.width / 2,
      ),
    );
    const y = Math.max(
      -130,
      Math.min(
        130,
        source.top + source.height / 2 - target.top - target.height / 2,
      ),
    );
    node.style.setProperty("--origin-x", `${x}px`);
    node.style.setProperty("--origin-y", `${y}px`);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    if (!reduced.matches) {
      const animation = node.animate(
        [
          {
            opacity: 0,
            transform: `perspective(1200px) translate3d(${x}px, ${y}px, 0) rotateX(9deg) rotateY(-5deg) scale(.78)`,
            borderRadius: "48px",
          },
          {
            opacity: 1,
            transform:
              "perspective(1200px) translate3d(0, -3px, 0) rotateX(-1deg) rotateY(.5deg) scale(1.006)",
            offset: 0.76,
          },
          {
            opacity: 1,
            transform:
              "perspective(1200px) translate3d(0, 0, 0) rotateX(0) rotateY(0) scale(1)",
            borderRadius: getComputedStyle(node).borderRadius,
          },
        ],
        { duration: 760, easing: "cubic-bezier(.16, 1, .3, 1)" },
      );
      surfaceAnimation.current = animation;
      animation.finished
        .then(() => {
          if (node.dataset.phase === "enter") node.dataset.phase = "idle";
        })
        .catch(() => {});
    } else node.dataset.phase = "idle";
    const reduceMotion = () => {
      if (reduced.matches) surfaceAnimation.current?.finish();
    };
    reduced.addEventListener("change", reduceMotion);
    document.body.style.overflow = "hidden";
    node.querySelector('input[name="name"]')?.focus({ preventScroll: true });
    return () => {
      surfaceAnimation.current?.cancel();
      reduced.removeEventListener("change", reduceMotion);
      document.body.style.overflow = previousOverflow;
      if (node.open) node.close();
      trigger?.focus({ preventScroll: true });
    };
  }, [open]);
  function dismiss() {
    const node = dialog.current;
    if (!node?.open || node.dataset.phase === "exit") return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOpen(false);
      return;
    }
    const current = getComputedStyle(node);
    const transform = current.transform;
    const opacity = current.opacity;
    surfaceAnimation.current?.cancel();
    node.dataset.phase = "exit";
    const animation = node.animate(
      [
        { transform, opacity },
        {
          transform:
            "perspective(1200px) translate3d(calc(var(--origin-x) * .22), 24px, 0) rotateX(4deg) scale(.94)",
          opacity: 0,
        },
      ],
      { duration: 260, easing: "cubic-bezier(.4, 0, 1, 1)", fill: "forwards" },
    );
    surfaceAnimation.current = animation;
    animation.finished.then(() => setOpen(false)).catch(() => {});
  }
  function move(event) {
    if (
      event.pointerType === "touch" ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const rect = event.currentTarget.getBoundingClientRect();
    closing.current.style.setProperty(
      "--magnet-x",
      `${(event.clientX - rect.left - rect.width / 2) * 0.045}px`,
    );
    closing.current.style.setProperty(
      "--magnet-y",
      `${(event.clientY - rect.top - rect.height / 2) * 0.075}px`,
    );
  }
  function leave() {
    closing.current.style.setProperty("--magnet-x", "0px");
    closing.current.style.setProperty("--magnet-y", "0px");
  }
  function validate(field) {
    const value = field.value.trim();
    if (!value)
      return {
        name: "Please enter your name.",
        email: "Please enter your email.",
        message: "Please write a message.",
      }[field.name];
    if (field.name === "email" && field.validity.typeMismatch)
      return "Please enter a valid email address.";
    if (field.name === "message" && value.length < 5)
      return "Please write at least 5 characters.";
    return "";
  }
  function updateField(event) {
    const field = event.target;
    if (errors[field.name])
      setErrors((previous) => ({ ...previous, [field.name]: validate(field) }));
    if (state === "success" || state === "error") setState("idle");
  }
  async function submit(event) {
    event.preventDefault();
    if (submitting.current) return;
    const form = event.currentTarget;
    const nextErrors = {};
    for (const name of ["name", "email", "message"]) {
      const error = validate(form.elements.namedItem(name));
      if (error) nextErrors[name] = error;
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setState("idle");
      form.elements.namedItem(Object.keys(nextErrors)[0]).focus();
      return;
    }
    const data = new FormData(form);
    if (data.get("botcheck")) return;
    submitting.current = true;
    setState("sending");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          access_key: "0e631d90-1efb-42a3-b147-578dd4ab9dea",
          subject: "New portfolio inquiry",
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error("Submission failed");
      form.reset();
      setState("success");
    } catch {
      setState("error");
    } finally {
      clearTimeout(timeout);
      submitting.current = false;
    }
  }
  return (
    <section className="closing-section" id="contact" ref={closing}>
      <div className="closing-byline" id="about">
        <h2>Thanakrit.</h2>
        <p>
          Full-stack & data science.
          <br />
          Mahidol University.
        </p>
        <a
          href="/CV_Thanakrit_Rattanaumnuaysiri.pdf"
          target="_blank"
          rel="noreferrer"
        >
          Résumé <FiArrowUpRight />
        </a>
      </div>
      <div className="closing-atmosphere" aria-hidden="true">
        <i />
        <i />
      </div>
      <button
        className="closing-invitation"
        ref={invitation}
        aria-label="Start a conversation"
        onClick={() => setOpen(true)}
        onPointerMove={move}
        onPointerLeave={leave}
      >
        <span className="closing-type">
          Let’s
          <br />
          <em>create.</em>
        </span>
        <span className="closing-glass liquid-panel" aria-hidden="true">
          <FiArrowUpRight />
        </span>
      </button>
      <footer className="closing-footer">
        <span>© {new Date().getFullYear()} Thanakrit</span>
        <div>
          <a href="https://github.com/octovir" target="_blank" rel="noreferrer">
            GitHub <FiArrowUpRight />
          </a>
          <a href="tel:+66655022750">
            Call <FiArrowUpRight />
          </a>
        </div>
        <a href="#home" aria-label="Back to top">
          <FiArrowUp />
        </a>
      </footer>
      <dialog
        className="contact-dialog"
        ref={dialog}
        aria-labelledby="dialog-title"
        onCancel={(event) => {
          event.preventDefault();
          dismiss();
        }}
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;
          const rect = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom
          )
            dismiss();
        }}
      >
        <span className="dialog-caustic" aria-hidden="true" />
        <button
          className="dialog-close"
          onClick={dismiss}
          aria-label="Close contact form"
        >
          <FiX />
        </button>
        <h2 id="dialog-title">Hello.</h2>
        <form
          className="contact-form"
          onSubmit={submit}
          noValidate
          onInput={updateField}
          aria-label="Contact Thanakrit"
        >
          <div className="form-row">
            <label>
              Your name
              <input
                name="name"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={
                  errors.name ? "contact-name-error" : undefined
                }
                autoComplete="name"
                placeholder="Alex Smith"
                required
                maxLength={120}
              />
              {errors.name && (
                <span
                  className="field-error"
                  id="contact-name-error"
                  aria-hidden="true"
                >
                  {errors.name}
                </span>
              )}
            </label>
            <label>
              Email address
              <input
                name="email"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={
                  errors.email ? "contact-email-error" : undefined
                }
                type="email"
                autoComplete="email"
                placeholder="alex@example.com"
                required
                maxLength={254}
              />
              {errors.email && (
                <span
                  className="field-error"
                  id="contact-email-error"
                  aria-hidden="true"
                >
                  {errors.email}
                </span>
              )}
            </label>
          </div>
          <label>
            Your message
            <textarea
              name="message"
              aria-invalid={Boolean(errors.message)}
              aria-describedby={
                errors.message ? "contact-message-error" : undefined
              }
              placeholder="Tell me a little about what you have in mind…"
              required
              minLength={5}
              maxLength={5000}
              rows={4}
            />
            {errors.message && (
              <span
                className="field-error"
                id="contact-message-error"
                aria-hidden="true"
              >
                {errors.message}
              </span>
            )}
          </label>
          <input
            type="checkbox"
            name="botcheck"
            className="botcheck"
            tabIndex={-1}
            aria-hidden="true"
          />
          <div className="form-footer">
            <button
              className="button button-blue"
              type="submit"
              disabled={state === "sending"}
            >
              {state === "sending" ? "Sending…" : "Send message"}
              <FiArrowRight />
            </button>
          </div>
          {state === "success" && (
            <p className="form-success" role="status">
              Message sent. Thanks for reaching out!
            </p>
          )}
          {state === "error" && (
            <p className="form-error" role="alert">
              Your message couldn’t be sent. Please try again, or call me using
              +66 65 502 2750.
            </p>
          )}
        </form>
      </dialog>
    </section>
  );
}
