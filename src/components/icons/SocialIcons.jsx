// lucide-react no longer ships trademarked brand marks (Instagram, LinkedIn).
// These are authored in the same single-stroke, round-cap/join grammar as the
// rest of the icon set (stroke-width 2, 24x24 viewBox) so they read as one system.

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function LinkedinIcon({ size = 18, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...rest}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <line x1="8" y1="11" x2="8" y2="16" />
      <line x1="8" y1="8" x2="8" y2="8.01" />
      <line x1="12" y1="16" x2="12" y2="11" />
      <path d="M12 13a2 2 0 0 1 4 0v3" />
    </svg>
  );
}

export function InstagramIcon({ size = 18, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...rest}>
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <circle cx="12" cy="12" r="4" />
      <line x1="16.5" y1="7.5" x2="16.5" y2="7.51" />
    </svg>
  );
}
