import StockSearch from "./StockSearch";

export default function Watchlist({ stocks, setTicker }) {
  return (
    <div className="bg-slate-900 p-4 rounded-xl h-full overflow-y-auto">
      <h2 className="text-lg font-semibold mb-3 text-slate-300">Watchlist</h2>

      <StockSearch stocks={stocks} setTicker={setTicker} />

      <div className="space-y-2 overflow-y-auto h-[75%]">
        {stocks.map((stock) => (
          <div
            key={stock}
            className="flex justify-between items-center px-3 py-2 rounded hover:bg-slate-800 cursor-pointer transition"
            onClick={() => setTicker(stock)}
          >
            <span className="font-medium">{stock}</span>

            <span className="text-xs text-slate-400">NSE</span>
          </div>
        ))}
      </div>
    </div>
  );
}
