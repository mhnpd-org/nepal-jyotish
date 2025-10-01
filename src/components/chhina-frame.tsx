"use client";
import React from "react";

/**
 * ChhinaFrame
 * A reusable decorative frame inspired by traditional Nepali (चिह्न / छीना) handwritten kundali borders.
 * Features:
 * - Layered double border (auspicious red + subtle dashed inner line)
 * - Paper-like subtle texture & soft inner glow for a refined printed feel
 * - Optional corner motifs using inline SVG (geometric mandala-flower hybrid)
 */
export interface ChhinaFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  withCorners?: boolean;
}

export const ChhinaFrame: React.FC<ChhinaFrameProps> = ({
  className = "",
  children,
  withCorners = true,
  ...rest
}) => {
  return (
    <div className={`chhina-frame ${className}`} {...rest}>
      {withCorners && <CornerOrnaments />}
      {children}
    </div>
  );
};

const CornerOrnaments: React.FC = () => {
  const svg = encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' stroke='#b71c1c' stroke-width='4' fill='none'>` +
      `<circle cx='50' cy='50' r='18' stroke='#d32f2f' stroke-width='3'/>` +
      `<path d='M50 8 L58 34 L92 34 L64 52 L74 84 L50 66 L26 84 L36 52 L8 34 L42 34 Z' stroke-linejoin='round' />` +
      `</svg>`
  );
  const base =
    "pointer-events-none absolute w-16 h-16 opacity-70 [background-size:90%] bg-no-repeat";
  return (
    <>
      <span
        aria-hidden
        className={`${base} -top-3 -left-3 rotate-0`}
        style={{ backgroundImage: `url("data:image/svg+xml,${svg}")` }}
      />
      <span
        aria-hidden
        className={`${base} -top-3 -right-3 rotate-90`}
        style={{ backgroundImage: `url("data:image/svg+xml,${svg}")` }}
      />
      <span
        aria-hidden
        className={`${base} -bottom-3 -left-3 -rotate-90`}
        style={{ backgroundImage: `url("data:image/svg+xml,${svg}")` }}
      />
      <span
        aria-hidden
        className={`${base} -bottom-3 -right-3 rotate-180`}
        style={{ backgroundImage: `url("data:image/svg+xml,${svg}")` }}
      />
    </>
  );
};

export default ChhinaFrame;
