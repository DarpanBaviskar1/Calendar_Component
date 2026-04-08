import { useEffect, useMemo, useState } from "react";

const DROP_COUNT = 140;

function buildDrops() {
  return Array.from({ length: DROP_COUNT }, (_, i) => {
    const left = Math.random() * 120;
    const delay = Math.random() * -2;
    const duration = 0.35 + Math.random() * 0.6;
    const opacity = 0.2 + Math.random() * 0.6;
    const thickness = 1 + Math.random() * 1.5;
    return {
      id: `drop-${i}`,
      style: {
        "--left": `${left}vw`,
        "--delay": `${delay}s`,
        "--duration": `${duration}s`,
        "--opacity": opacity,
        "--thickness": `${thickness}px`,
      },
    };
  });
}

export default function RainLayer() {
  const drops = useMemo(() => buildDrops(), []);
  const [angle, setAngle] = useState(91);
  const [lightning, setLightning] = useState(false);

  useEffect(() => {
    let lightningTimeout = null;

    const handleMove = (event) => {
      const ratio = event.clientX / window.innerWidth;
      const next = 80 + ratio * 22;
      setAngle(next);
    };

    const handleDown = () => {
      setLightning(true);
      if (lightningTimeout) window.clearTimeout(lightningTimeout);
      lightningTimeout = window.setTimeout(() => setLightning(false), 350);
    };

    const handleUp = () => {
      setLightning(false);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mousedown", handleDown);
    window.addEventListener("mouseup", handleUp);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mousedown", handleDown);
      window.removeEventListener("mouseup", handleUp);
      if (lightningTimeout) window.clearTimeout(lightningTimeout);
    };
  }, []);

  return (
    <div
      className={`rain-layer ${lightning ? "rain-lightning" : ""}`}
      style={{ "--angle": `${angle}deg` }}
      aria-hidden="true"
    >
      {drops.map((drop) => (
        <div key={drop.id} className="rain-drop" style={drop.style}>
          <span className="rain-stem" />
          <span className="rain-splat" />
        </div>
      ))}
    </div>
  );
}
