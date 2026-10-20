// Turns `**phrase**` inside a copy string into a highlighted span, so the
// data files can mark the one phrase per paragraph a skimmer should catch.
// Strings without markers come back unchanged. The parts are wrapped in one
// span so a flex parent still lays the text out as a single item.
export function rich(text) {
  if (typeof text !== "string" || !text.includes("**")) return text;
  return (
    <span>
      {text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
        i % 2 ? (
          <strong key={i} className="hl">
            {part}
          </strong>
        ) : (
          part
        ),
      )}
    </span>
  );
}
