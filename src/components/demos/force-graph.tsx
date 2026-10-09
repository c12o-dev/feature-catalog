"use client";

const nodes = [
  { id: 0, x: 200, y: 110, label: "Hub" },
  { id: 1, x: 80, y: 50 }, { id: 2, x: 80, y: 170 }, { id: 3, x: 320, y: 50 }, { id: 4, x: 320, y: 170 },
  { id: 5, x: 130, y: 30 }, { id: 6, x: 270, y: 30 }, { id: 7, x: 50, y: 110 }, { id: 8, x: 350, y: 110 },
];
const edges = [
  [0, 1], [0, 2], [0, 3], [0, 4], [1, 5], [3, 6], [1, 7], [3, 8], [2, 7], [4, 8],
];

export default function ForceGraph() {
  return (
    <svg viewBox="0 0 400 220" className="w-full">
      {edges.map(([a, b], i) => (
        <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y} stroke="currentColor" strokeOpacity="0.25" />
      ))}
      {nodes.map((n) => (
        <g key={n.id}>
          <circle cx={n.x} cy={n.y} r={n.label ? 10 : 5} className={n.label ? "fill-blue-500" : "fill-foreground/40"} />
          {n.label && <text x={n.x} y={n.y + 25} textAnchor="middle" fontSize="10" className="fill-foreground">{n.label}</text>}
        </g>
      ))}
    </svg>
  );
}
