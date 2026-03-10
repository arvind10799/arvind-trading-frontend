import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

export default function AnalyticsPanel({ equity }) {
  if (!equity) return null;

  const data = equity.map((v, i) => ({
    x: i,
    value: v,
  }));

  return (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl h-full">
      <h2 className="text-lg mb-4 font-semibold">Strategy Equity Curve</h2>

      <LineChart width={600} height={180} data={data}>
        <XAxis dataKey="x" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#22c55e"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </div>
  );
}
