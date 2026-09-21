import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

const SPRING = { stiffness: 220, damping: 18, mass: 0.6 };

// Leans its child toward the pointer while hovered and springs back on
// leave: a small physical "this is pressable" cue for primary actions.
// Motion values only, so pointer movement never re-renders React. Mouse
// only; touch and reduced motion get a plain wrapper.
export default function Magnetic({ children, strength = 0.3, className, as = "span" }) {
  const reduce = useReducedMotion();
  const x = useSpring(useMotionValue(0), SPRING);
  const y = useSpring(useMotionValue(0), SPRING);
  const Tag = motion[as];

  if (reduce) return <span className={className}>{children}</span>;

  const onMove = (e) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <Tag
      className={className}
      style={{ x, y, display: "inline-flex" }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </Tag>
  );
}
