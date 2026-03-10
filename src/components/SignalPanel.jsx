export default function SignalPanel({ data, ticker }) {
  if (!data) return null;

  const signalColor =
    data.signal === "BUY"
      ? "text-green-400"
      : data.signal === "SELL"
        ? "text-red-400"
        : "text-yellow-400";

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl h-full flex flex-col">
      {/* HEADER */}
      {/* <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-200">Trade Signal</h2> */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">{ticker}</h2>
        <p className="text-sm text-gray-400">AI Trade Signal</p>

        {/* STOCK NAME */}
        <span className="px-3 py-1 text-xs bg-slate-800 rounded-md text-blue-400 font-semibold">
          {ticker}
        </span>
      </div>

      {/* SIGNAL */}
      <div className="mb-6 flex items-center justify-between">
        <span className="text-sm text-gray-400">Signal</span>

        <span className={`text-xl font-bold ${signalColor}`}>
          {data.signal}
        </span>
      </div>

      {/* CONFIDENCE */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-400">Confidence</span>
          <span>{data.confidence}%</span>
        </div>

        <div className="w-full bg-slate-800 rounded h-2">
          <div
            className="bg-green-500 h-2 rounded"
            style={{ width: `${data.confidence}%` }}
          />
        </div>
      </div>

      {/* TRADE SETUP */}
      <div className="space-y-4 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Entry</span>
          <span className="font-medium">₹{Number(data.entry).toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">Stop Loss</span>
          <span className="text-red-400">
            ₹{Number(data.stop_loss).toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">Take Profit</span>
          <span className="text-green-400">
            ₹{Number(data.take_profit).toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">ATR</span>
          <span>{Number(data.atr).toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">ML Probability</span>
          <span className="text-purple-400 font-medium">
            {data.ml_probability}%
          </span>
        </div>
      </div>
    </div>
  );
}
