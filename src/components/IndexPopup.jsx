import { useEffect, useState } from "react";
import axios from "axios";

export default function IndexPopup({ index, onClose, setTicker }) {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setLoading(true);

        //const res = await axios.get(`http://localhost:8000/index/${index}`);
        const res = await axios.get(
          `https://arvind-trading-backend.onrender.com/index/${index}`,
        );

        setStocks(res.data || []);
      } catch (err) {
        console.error("Index fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, [index]);

  /* TOP MOVERS (safe sort) */

  const gainers = [...stocks]
    .filter((s) => s.change !== null)
    .sort((a, b) => b.change - a.change)
    .slice(0, 3);

  const losers = [...stocks]
    .filter((s) => s.change !== null)
    .sort((a, b) => a.change - b.change)
    .slice(0, 3);

  /* CHANGE FORMATTER */

  const formatChange = (s) => {
    if (s.change === null || s.points === null) return "-";

    const up = s.change > 0;

    const arrow = up ? "▲" : "▼";
    const color = up ? "text-green-400" : "text-red-400";

    return (
      <span className={color}>
        {arrow} {Math.abs(s.points).toFixed(2)} ({Math.abs(s.change).toFixed(2)}
        %)
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-slate-900 w-[650px] rounded-xl p-6 max-h-[75vh] overflow-y-auto border border-slate-700">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {index.toUpperCase()} Stocks
          </h2>

          <button
            onClick={onClose}
            className="text-red-400 hover:text-red-300 text-lg"
          >
            ✕
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-40 gap-3">
            <div className="w-10 h-10 border-4 border-slate-700 border-t-green-400 rounded-full animate-spin"></div>
            <p className="text-sm text-gray-400">Loading index data...</p>
          </div>
        ) : (
          <>
            {/* TOP MOVERS */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              {/* TOP GAINERS */}
              <div className="bg-slate-800 rounded-lg p-3">
                <h3 className="text-green-400 text-sm font-semibold mb-2">
                  Top Gainers
                </h3>

                {gainers.map((g) => (
                  <div key={g.symbol} className="flex justify-between text-sm">
                    <span>{g.symbol}</span>

                    <span className="text-green-400">
                      ▲ {Math.abs(g.points).toFixed(2)} (
                      {Math.abs(g.change).toFixed(2)}%)
                    </span>
                  </div>
                ))}
              </div>

              {/* TOP LOSERS */}
              <div className="bg-slate-800 rounded-lg p-3">
                <h3 className="text-red-400 text-sm font-semibold mb-2">
                  Top Losers
                </h3>

                {losers.map((l) => (
                  <div key={l.symbol} className="flex justify-between text-sm">
                    <span>{l.symbol}</span>

                    <span className="text-red-400">
                      ▼ {Math.abs(l.points).toFixed(2)} (
                      {Math.abs(l.change).toFixed(2)}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* STOCK TABLE */}
            <table className="w-full text-sm">
              <thead className="border-b border-slate-700 text-gray-400">
                <tr>
                  <th className="text-left py-2">Stock</th>
                  <th className="text-right py-2">Price</th>
                  <th className="text-right py-2">Change</th>
                </tr>
              </thead>

              <tbody>
                {stocks.map((s) => (
                  <tr
                    key={s.symbol}
                    className={`border-b border-slate-800 cursor-pointer transition
                    ${
                      s.change > 0
                        ? "hover:bg-green-900/20"
                        : "hover:bg-red-900/20"
                    }`}
                    onClick={() => {
                      setTicker(s.symbol);
                      onClose();
                    }}
                  >
                    <td className="py-2 font-semibold text-blue-400">
                      {s.symbol}
                    </td>

                    <td className="text-right">
                      {s.price ? s.price.toFixed(2) : "-"}
                    </td>

                    <td className="text-right">{formatChange(s)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}
