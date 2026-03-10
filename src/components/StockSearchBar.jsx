import { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function StockSearchBar({ setTicker }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [prices, setPrices] = useState({});
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showRecent, setShowRecent] = useState(false);

  const [recent, setRecent] = useState(
    JSON.parse(localStorage.getItem("recentStocks")) || [],
  );

  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // -------- "/" SHORTCUT --------

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "/") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // -------- CLICK OUTSIDE CLOSE --------

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!containerRef.current?.contains(e.target)) {
        setShowRecent(false);
        setResults([]);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // -------- DEBOUNCED SEARCH --------

  useEffect(() => {
    if (query.length < 2) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResults([]);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        const res = await axios.get(
          `https://query1.finance.yahoo.com/v1/finance/search?q=${query}`,
        );

        const stocks = res.data.quotes.filter(
          (q) =>
            q.quoteType === "EQUITY" && q.symbol && q.symbol.endsWith(".NS"),
        );

        setResults(stocks.slice(0, 8));
        setShowRecent(false);
      } catch (err) {
        console.error("Search error:", err);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [query]);

  // -------- FETCH LIVE PRICES --------

  useEffect(() => {
    const fetchPrices = async () => {
      if (!results.length) return;

      try {
        const symbols = results.map((s) => s.symbol).join(",");

        const res = await axios.get(
          `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols}`,
        );

        const map = {};

        res.data.quoteResponse.result.forEach((item) => {
          const symbol = item.symbol.replace(".NS", "");

          map[symbol] = {
            price: item.regularMarketPrice,
            change: item.regularMarketChangePercent,
          };
        });

        setPrices(map);
      } catch (err) {
        console.error("Price fetch error:", err);
      }
    };

    fetchPrices();
  }, [results]);

  // -------- SELECT STOCK --------

  const selectStock = (stock) => {
    const symbol = stock.symbol.replace(".NS", "");

    setTicker(symbol);

    const updatedRecent = [symbol, ...recent.filter((s) => s !== symbol)].slice(
      0,
      5,
    );

    setRecent(updatedRecent);

    localStorage.setItem("recentStocks", JSON.stringify(updatedRecent));

    setQuery("");
    setResults([]);
    setSelectedIndex(-1);
    setShowRecent(false);
  };

  // -------- KEYBOARD NAVIGATION --------

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

  // -------- HIGHLIGHT MATCH --------

  const highlightMatch = (text) => {
    if (!query) return text;

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
    <div ref={containerRef} className="relative w-full sm:w-72">
      {/* SEARCH INPUT */}

      <input
        ref={inputRef}
        type="text"
        value={query}
        onFocus={() => {
          if (query.length === 0) setShowRecent(true);
        }}
        onChange={(e) => {
          setQuery(e.target.value);
          setSelectedIndex(-1);
        }}
        onKeyDown={handleKeyDown}
        placeholder="Search NSE stock..."
        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-white focus:outline-none focus:border-blue-500"
      />

      {/* RECENT STOCKS */}

      {showRecent && query.length === 0 && recent.length > 0 && (
        <div className="absolute left-0 right-0 bg-slate-900 border border-slate-700 mt-1 rounded shadow-xl z-50">
          <div className="px-3 py-2 text-xs text-gray-400 border-b border-slate-700">
            Recent
          </div>

          {recent.map((stock) => (
            <div
              key={stock}
              onClick={() => {
                setTicker(stock);
                setShowRecent(false);
              }}
              className="px-3 py-2 hover:bg-slate-800 cursor-pointer text-sm"
            >
              {stock}
            </div>
          ))}
        </div>
      )}

      {/* SEARCH RESULTS */}

      {results.length > 0 && (
        <div className="absolute left-0 right-0 bg-slate-900 border border-slate-700 mt-1 rounded max-h-60 overflow-y-auto z-50 shadow-xl">
          {results.map((stock, index) => {
            const symbol = stock.symbol.replace(".NS", "");
            const priceData = prices[symbol];

            return (
              <div
                key={stock.symbol}
                onClick={() => selectStock(stock)}
                className={`px-3 py-2 cursor-pointer ${
                  selectedIndex === index
                    ? "bg-slate-700"
                    : "hover:bg-slate-800"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-white">
                      {highlightMatch(symbol)}
                    </span>

                    <div className="text-xs text-gray-400 truncate">
                      {highlightMatch(stock.shortname || "")}
                    </div>
                  </div>

                  {priceData && (
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        ₹{priceData.price?.toFixed(2)}
                      </div>

                      <div
                        className={`text-xs ${
                          priceData.change >= 0
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {priceData.change >= 0 ? "▲" : "▼"}{" "}
                        {priceData.change?.toFixed(2)}%
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
