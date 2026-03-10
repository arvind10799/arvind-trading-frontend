export default function TradeXLogo() {
  return (
    <div className="flex items-center group cursor-pointer transition-all duration-300 hover:scale-105">
      <svg
        viewBox="0 0 600 200"
        className="h-12 md:h-16 lg:h-20 w-auto transition-all duration-300 group-hover:drop-shadow-[0_0_10px_#00ff88]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Animated Gradient */}
          <linearGradient id="gradX" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00c6ff">
              <animate
                attributeName="stop-color"
                values="#00c6ff;#00ff88;#00c6ff"
                dur="5s"
                repeatCount="indefinite"
              />
            </stop>

            <stop offset="100%" stopColor="#00ff88" />
          </linearGradient>

          {/* Glow Filter */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Chart Bars */}
        <g transform="translate(40,60)">
          <rect x="0" y="40" width="12" height="40" fill="#1e88e5" />
          <rect x="18" y="25" width="12" height="55" fill="#1e88e5" />
          <rect x="36" y="10" width="12" height="70" fill="#1e88e5" />
          <rect x="54" y="0" width="12" height="80" fill="#1e88e5" />
        </g>

        {/* Trend Line */}
        <polyline
          points="40,110 70,90 100,80 120,60"
          fill="none"
          stroke="#00ff88"
          strokeWidth="4"
          filter="url(#glow)"
        />

        <polygon points="120,60 112,68 128,66" fill="#00ff88" />

        {/* Trade */}
        <text
          x="150"
          y="95"
          fontFamily="Segoe UI, Arial"
          fontSize="48"
          fill="#e6e6e6"
          fontWeight="600"
        >
          Trade
        </text>

        {/* X Highlight */}
        <text
          x="290"
          y="95"
          fontFamily="Segoe UI, Arial"
          fontSize="48"
          fill="url(#gradX)"
          fontWeight="700"
          filter="url(#glow)"
        >
          X
        </text>

        {/* Subtitle */}
        <text
          x="150"
          y="130"
          fontFamily="Segoe UI, Arial"
          fontSize="16"
          fill="#9aa4b2"
          letterSpacing="2"
        >
          BY ARVIND SAINI
        </text>
      </svg>
    </div>
  );
}
