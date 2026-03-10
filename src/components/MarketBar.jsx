import { useEffect, useState } from "react";
import axios from "axios";
import StockSearchBar from "./StockSearchBar";
import TradeXLogo from "./TradeXLogo";
import IndexPopup from "./IndexPopup";
import IndexChartPopup from "./IndexChartPopup";

export default function MarketBar({ setTicker, stocks, signal }) {
  const [market, setMarket] = useState({});
  const [prevMarket, setPrevMarket] = useState({});
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [chartTicker, setChartTicker] = useState(null);

  const fetchMarket = async () => {
    try {
      //const res = await axios.get("http://localhost:8000/market");
      const res = await axios.get(
        "https://arvind-trading-backend.onrender.com/market",
      );
      setPrevMarket(market);
      setMarket(res.data);
    } catch (err) {
      console.error("Market fetch error:", err);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMarket();
    const interval = setInterval(fetchMarket, 15000);
    return () => clearInterval(interval);
  }, []);

  const tickerItems = Object.entries(market);

  /* ---------------- INDEX POPUP MAPPING ---------------- */

  const indexMap = {
    NIFTY50: "nifty50",
    NIFTYBANK: "banknifty",
    NIFTYFINANCIALSERVICES: "finnifty",
    NIFTYNEXT50: "niftynext50",

    NIFTYIT: "niftyit",
    NIFTYAUTO: "niftyauto",
    NIFTYFMCG: "niftyfmcg",
    NIFTYPHARMA: "niftypharma",
    NIFTYMETAL: "niftymetal",
    NIFTYREALTY: "niftyrealty",
    NIFTYMEDIA: "niftymedia",
    NIFTYENERGY: "niftyenergy",

    PSUBANK: "psubank",
    PRIVATEBANK: "privatebank",

    MIDCAP50: "midcap50",
    MIDCAP100: "midcap100",
    MIDCAP150: "midcap150",

    SMALLCAP50: "smallcap50",
    SMALLCAP100: "smallcap100",
    SMALLCAP250: "smallcap250",
  };

  const getIndexKey = (name) => {
    const key = name.toUpperCase().replace(/\s/g, "");
    return indexMap[key] || "nifty50";
  };

  const getChartTicker = (name) => {
    const key = name.toUpperCase().replace(/\s/g, "");
    return key || "NIFTY50";
  };

  return (
    <div className="bg-slate-950 border-b border-slate-800">
      {/* HEADER */}
      <div className="px-4 py-3 flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* LOGO */}
        <div className="flex items-center shrink-0">
          <TradeXLogo />
        </div>

        {/* SEARCH */}
        <div className="w-full lg:w-auto flex justify-center">
          <StockSearchBar
            stocks={stocks}
            setTicker={setTicker}
            signal={signal?.signal}
          />
        </div>
      </div>

      {/* TICKER BAR */}
      <div className="relative w-full overflow-hidden border-t border-slate-800 group">
        <div className="pointer-events-none absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-slate-950 to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-slate-950 to-transparent z-10" />

        <div className="flex gap-16 whitespace-nowrap animate-market-scroll px-12 py-2 group-hover:[animation-play-state:paused]">
          {[...tickerItems, ...tickerItems].map(([name, data], index) => {
            const prevPrice = prevMarket[name]?.price;

            const priceUp = prevPrice && data.price > prevPrice;
            const priceDown = prevPrice && data.price < prevPrice;

            return (
              <div
                key={`${name}-${index}`}
                className="flex items-center gap-2 text-sm shrink-0"
              >
                {/* INDEX NAME */}
                <span
                  className="font-semibold text-gray-300 cursor-pointer hover:text-white hover:underline"
                  onClick={() => setSelectedIndex(getIndexKey(name))}
                >
                  {name}
                </span>

                {/* PRICE */}
                <span
                  className={
                    priceUp
                      ? "animate-flash-green"
                      : priceDown
                        ? "animate-flash-red"
                        : ""
                  }
                >
                  {data?.price ?? "-"}
                </span>

                {/* CHANGE */}
                <span
                  className={
                    data?.change > 0 ? "text-green-400" : "text-red-400"
                  }
                >
                  {data?.change > 0 ? "▲" : "▼"} {data?.change ?? 0}%
                </span>

                {/* CHART BUTTON */}
                <button
                  className="text-blue-400 ml-2 hover:text-blue-300"
                  onClick={() => setChartTicker(getChartTicker(name))}
                >
                  📊
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* INDEX STOCK POPUP */}
      {selectedIndex && (
        <IndexPopup
          index={selectedIndex}
          setTicker={setTicker}
          onClose={() => setSelectedIndex(null)}
        />
      )}

      {/* INDEX CHART POPUP */}
      {chartTicker && (
        <IndexChartPopup
          ticker={chartTicker}
          onClose={() => setChartTicker(null)}
        />
      )}
    </div>
  );
}
