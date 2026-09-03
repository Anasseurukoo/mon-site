import { CSSProperties } from "react";

interface PetalCSSProperties extends CSSProperties {
  "--petal-drift"?: string;
  "--petal-sway"?: string;
}

const PETALS = [
  { left: "6%",  delay: "0s",   fall: "17s", sway: "6s",  spin: "9s",  size: 10, drift: "3vw",  swayDist: "1.2vw", opacity: 0.65 },
  { left: "14%", delay: "-4s",  fall: "21s", sway: "7s",  spin: "11s", size: 12, drift: "5vw",  swayDist: "2vw",   opacity: 0.8 },
  { left: "23%", delay: "-8s",  fall: "18s", sway: "6.5s",spin: "10s", size: 8,  drift: "-2vw", swayDist: "1.5vw", opacity: 0.55 },
  { left: "31%", delay: "-1s",  fall: "24s", sway: "8s",  spin: "13s", size: 14, drift: "4vw",  swayDist: "2.6vw", opacity: 0.72 },
  { left: "41%", delay: "-10s", fall: "20s", sway: "7.5s",spin: "12s", size: 9,  drift: "-3vw", swayDist: "1.8vw", opacity: 0.6 },
  { left: "52%", delay: "-7s",  fall: "23s", sway: "9s",  spin: "14s", size: 12, drift: "5vw",  swayDist: "2.4vw", opacity: 0.75 },
  { left: "63%", delay: "-3s",  fall: "19s", sway: "7s",  spin: "9s",  size: 8,  drift: "-4vw", swayDist: "1.6vw", opacity: 0.58 },
  { left: "71%", delay: "-12s", fall: "26s", sway: "10s", spin: "15s", size: 13, drift: "4vw",  swayDist: "3vw",   opacity: 0.78 },
  { left: "79%", delay: "-6s",  fall: "18s", sway: "6s",  spin: "10s", size: 10, drift: "-2vw", swayDist: "1.1vw", opacity: 0.62 },
  { left: "88%", delay: "-14s", fall: "22s", sway: "8s",  spin: "12s", size: 11, drift: "3vw",  swayDist: "2vw",   opacity: 0.7 },
  { left: "94%", delay: "-9s",  fall: "25s", sway: "9s",  spin: "16s", size: 7,  drift: "-1vw", swayDist: "1vw",   opacity: 0.5 },
];

export function PetalDrift() {
  return (
    <div className="petal-rain" aria-hidden="true">
      {PETALS.map((petal, i) => {
        const style: PetalCSSProperties = {
          left: petal.left,
          width: `${petal.size}px`,
          height: `${Math.round(petal.size * 1.35)}px`,
          opacity: petal.opacity,
          animationDelay: `${petal.delay}, ${petal.delay}, ${petal.delay}`,
          animationDuration: `${petal.fall}, ${petal.sway}, ${petal.spin}`,
          "--petal-drift": petal.drift,
          "--petal-sway": petal.swayDist,
        };

        return <span key={i} className="petal" style={style} />;
      })}
    </div>
  );
}
