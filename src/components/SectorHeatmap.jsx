/* eslint-disable react-hooks/static-components */

import { Treemap, ResponsiveContainer, Tooltip } from "recharts";

export default function SectorHeatmap({ data, setTicker }) {
  const getColor = (change) => {
    if (change >= 3) return "#14532d";
    if (change > 0) return "#16a34a";
    if (change <= -3) return "#7f1d1d";
    if (change < 0) return "#dc2626";
    return "#334155";
  };

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;

    const s = payload[0].payload;

    return (
      <div className="bg-slate-900/95 border border-slate-700 rounded-xl p-4 shadow-2xl text-xs backdrop-blur">
        <div className="text-white font-semibold text-sm tracking-wide">
          {s.name}
        </div>

        <div className="text-gray-400 mt-1">Price ₹{s.price ?? "-"}</div>

        <div
          className={`mt-2 font-semibold text-sm ${
            s.change > 0 ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {s.change > 0 ? "+" : ""}
          {s.change}%
        </div>

        <div className="text-gray-500 mt-2 text-[10px]">
          Click to open chart
        </div>
      </div>
    );
  };

  const CustomNode = (props) => {
    const { x, y, width, height, name, change, price } = props;

    const showFull = width > 120 && height > 70;

    const momentumWidth = Math.min(Math.abs(change) * 10, width - 20);

    return (
      <g onClick={() => setTicker(name)} style={{ cursor: "pointer" }}>
        {/* TILE */}

        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          rx={12}
          fill={getColor(change)}
          stroke="#020617"
          strokeWidth={1}
          style={{
            filter: "drop-shadow(0px 4px 10px rgba(0,0,0,0.4))",
          }}
        />

        {/* SYMBOL */}

        {width > 60 && (
          <text
            x={x + 12}
            y={y + 24}
            fill="white"
            fontSize="13"
            fontWeight="600"
          >
            {name}
          </text>
        )}

        {/* CHANGE */}

        {width > 60 && (
          <text
            x={x + width - 12}
            y={y + 24}
            textAnchor="end"
            fill={change > 0 ? "#4ade80" : "#f87171"}
            fontSize="12"
            fontWeight="600"
          >
            {change > 0 ? "+" : ""}
            {change}%
          </text>
        )}

        {/* PRICE */}

        {showFull && (
          <text x={x + 12} y={y + 44} fill="#e2e8f0" fontSize="11">
            ₹{price ?? "-"}
          </text>
        )}

        {/* MOMENTUM BAR */}

        {showFull && (
          <rect
            x={x + 12}
            y={y + height - 10}
            width={momentumWidth}
            height={4}
            rx={2}
            fill="white"
            opacity="0.8"
          />
        )}
      </g>
    );
  };

  return (
    <div
      className="relative w-full h-[420px] rounded-2xl overflow-hidden
      bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900
      border border-slate-800 shadow-2xl"
    >
      {/* HEADER */}

      <div
        className="absolute top-0 left-0 right-0 h-11 flex items-center px-5
        text-xs text-gray-400 font-semibold tracking-wider
        border-b border-slate-800"
      >
        MARKET HEATMAP
      </div>

      <div className="pt-11 w-full h-full">
        <ResponsiveContainer>
          <Treemap
            data={data}
            dataKey="value"
            stroke="#020617"
            content={<CustomNode />}
            isAnimationActive
            animationDuration={650}
          >
            <Tooltip content={<CustomTooltip />} />
          </Treemap>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
