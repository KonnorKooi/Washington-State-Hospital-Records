/**
 * The site mark: a care cross built out of five cells of a 3x3 grid.
 *
 * It carries both halves of what this site is — the cross for health care,
 * the grid cells for the comparison matrix the data actually lives in. The
 * previous mark was a Washington state silhouette inside a soft-shadowed
 * circle, which was illegible below about 40px: the header renders this at
 * 32px and the browser tab at 16px, and a state outline is an unreadable blob
 * at both. A five-square plus survives down to 16px because it is built from
 * axis-aligned rectangles.
 *
 * Rendered inline rather than loaded as an image file so the arms and the
 * centre cell can be recoloured per context (white on the blue header, brand
 * blue on white) from one definition, with no extra request.
 */
export function Logo({
  className = "",
  armClassName = "fill-white",
  centerClassName = "fill-[#3ECF8E]",
  tileClassName = "fill-white/10",
}: {
  className?: string;
  armClassName?: string;
  centerClassName?: string;
  tileClassName?: string;
}) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      role="img"
      aria-label="Washington Care Access"
    >
      <rect width="32" height="32" rx="8" className={tileClassName} />
      {/* Four arms of the cross. */}
      {[
        [12, 4],
        [4, 12],
        [20, 12],
        [12, 20],
      ].map(([x, y]) => (
        <rect
          key={`${x}-${y}`}
          x={x}
          y={y}
          width="8"
          height="8"
          rx="2.2"
          className={armClassName}
        />
      ))}
      {/* Centre cell, in the same green the matrix uses for "offered". */}
      <rect
        x="12"
        y="12"
        width="8"
        height="8"
        rx="2.2"
        className={centerClassName}
      />
    </svg>
  );
}
