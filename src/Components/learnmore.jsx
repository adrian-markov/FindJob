import { useEffect, useRef, useState } from "react";
import "./learnmore.css";

export default function EnSavoirPlusInline({
  labelClosed = "En savoir plus",
  labelOpen = "Moins d'infos",
  defaultOpen = false,
  id = "details-panel",
  preview = "",
  children,
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [height, setHeight] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (open) {
      const fullHeight = el.scrollHeight;
      setHeight(fullHeight);
      const onEnd = () => {
        el.style.height = "auto";
        el.removeEventListener("transitionend", onEnd);
      };
      el.addEventListener("transitionend", onEnd);
    } else {
      el.style.height = el.getBoundingClientRect().height + "px";
      requestAnimationFrame(() => setHeight(0));
    }
  }, [open]);

  return (
    <div className="moreless">
      {!open && preview && (
        <p className="job_description text-gray-700">{preview}</p>
      )}

      <div
        id={id}
        ref={ref}
        className="moreless__content"
        style={{
          height: open ? height : 0,
          overflow: "hidden",
          transition: "height 0.3s ease",
        }}
      >
        <div className="card">{children}</div>
      </div>

      <button
        type="button"
        className="moreless__btn"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span>{open ? labelOpen : labelClosed}</span>
        <svg
          className={`chev ${open ? "rot" : ""}`}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            d="M6 9l6 6 6-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}