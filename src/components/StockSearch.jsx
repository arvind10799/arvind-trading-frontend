import { useState, useEffect } from "react";
import axios from "axios";

export default function StockSearchBar({ setTicker }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // ---------------- DEBOUNCED SEARCH ----------------

  useEffect(() => {
    if (query.length < 2) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        const res = await axios.get(
          `https://corsproxy.io/?https://query1.finance.yahoo.com/v1/finance/search?q=${query}`,
        );

        const stocks = res.data.quotes.filter(
          (q) =>
            q.quoteType === "EQUITY" && q.symbol && q.symbol.endsWith(".NS"),
        );

        setResults(stocks.slice(0, 8));
      } catch (err) {
        console.error("Search error:", err);
      }
    }, 400); // debounce delay

    return () => clearTimeout(delayDebounce);
  }, [query]);

  // ---------------- KEYBOARD NAVIGATION ----------------

  const handleKeyDown = (e) => {
    if (!results.length) return;

    if (e.key === "ArrowDown") {
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    }

    if (e.key === "ArrowUp") {
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    }

    if (e.key === "Enter") {
      if (selectedIndex >= 0) {
        selectStock(results[selectedIndex]);
      }
    }
  };

  const selectStock = (stock) => {
    setTicker(stock.symbol.replace(".NS", ""));
    setQuery("");
    setResults([]);
    setSelectedIndex(-1);
  };

  // ---------------- HIGHLIGHT MATCH ----------------

  const highlightMatch = (text) => {
    const index = text.toLowerCase().indexOf(query.toLowerCase());

    if (index === -1) return text;

    return (
      <>
        {text.slice(0, index)}
        <span className="text-blue-400 font-semibold">
          {text.slice(index, index + query.length)}
        </span>
        {text.slice(index + query.length)}
      </>
    );
  };

  return (
    <div className="relative w-full sm:w-72">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setSelectedIndex(-1);
        }}
        onKeyDown={handleKeyDown}
        placeholder="Search stock..."
        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-white focus:outline-none focus:border-blue-500"
      />

      {results.length > 0 && (
        <div className="absolute left-0 right-0 bg-slate-900 border border-slate-700 mt-1 rounded max-h-60 overflow-y-auto z-50 shadow-xl">
          {results.map((stock, index) => (
            <div
              key={stock.symbol}
              onClick={() => selectStock(stock)}
              className={`px-3 py-2 cursor-pointer transition ${
                selectedIndex === index ? "bg-slate-700" : "hover:bg-slate-800"
              }`}
            >
              <div className="flex justify-between">
                <span className="font-semibold text-white">
                  {highlightMatch(stock.symbol.replace(".NS", ""))}
                </span>

                <span className="text-xs text-gray-400">NSE</span>
              </div>

              <div className="text-xs text-gray-400 truncate">
                {highlightMatch(stock.shortname || "")}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
