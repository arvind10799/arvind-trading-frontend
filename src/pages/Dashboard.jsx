import { useState, useEffect } from "react";

import { getSignal, getCandles } from "../services/api";

import CandlestickChart from "../components/CandlestickChart";
import Watchlist from "../components/Watchlist";
import SignalPanel from "../components/SignalPanel";
import AIExplanation from "../components/AIExplanation";
import AnalyticsPanel from "../components/AnalyticsPanel";

import { getSectorHeatmap } from "../services/heatmapApi";
import SectorHeatmap from "../components/SectorHeatmap";

export default function Dashboard({ ticker, setTicker }) {
  const [signal, setSignal] = useState(null);
  const [candles, setCandles] = useState(null);

  const [period, setPeriod] = useState("1y");

  const [initialLoading, setInitialLoading] = useState(true);
  const [chartUpdating, setChartUpdating] = useState(false);
  const [heatmap, setHeatmap] = useState({});

  const stocks = [
    "RELIANCE",
    "TCS",
    "INFY",
    "HDFCBANK",
    "ICICIBANK",
    "KOTAKBANK",
    "SBIN",
    "HINDUNILVR",
    "ITC",
    "BAJFINANCE",
  ];

  // ---------- INITIAL LOAD ----------
  const fetchAllData = async () => {
    try {
      setInitialLoading(true);

      const [signalRes, candleRes] = await Promise.all([
        getSignal(ticker, period),
        getCandles(ticker, period),
      ]);

      setSignal(signalRes.data);
      setCandles(candleRes.data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setInitialLoading(false);
    }
  };

  // ---------- UPDATE CANDLES ONLY ----------
  const fetchCandlesOnly = async () => {
    try {
      setChartUpdating(true);

      const res = await getCandles(ticker, period);

      setCandles(res.data);
    } catch (err) {
      console.error("Candle update error:", err);
    } finally {
      setChartUpdating(false);
    }
  };

  // ---------- TICKER CHANGE ----------
  useEffect(() => {
    fetchAllData();
  }, [ticker]);

  // ---------- TIMEFRAME CHANGE ----------
  useEffect(() => {
    if (!initialLoading) {
      fetchCandlesOnly();
    }
  }, [period]);

  const timeframes = [
    { label: "1D", value: "1d" },
    { label: "5D", value: "5d" },
    { label: "1M", value: "1mo" },
    { label: "6M", value: "6mo" },
    { label: "1Y", value: "1y" },
  ];

  useEffect(() => {
    const fetchHeatmap = async () => {
      const data = await getSectorHeatmap();
      setHeatmap(data);
    };

    fetchHeatmap();

    const interval = setInterval(fetchHeatmap, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-gray-400">
        Loading market data...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4">
      {/* WATCHLIST */}

      <div className="lg:col-span-2 order-5 lg:order-1 lg:max-h-[calc(100vh-120px)] overflow-y-auto">
        <Watchlist stocks={stocks} setTicker={setTicker} />
      </div>

      {/* CHART */}

      <div className="lg:col-span-7 order-1 lg:order-2">
        {/* TIMEFRAME BUTTONS */}

        <div className="flex gap-2 mb-2">
          {timeframes.map((tf) => (
            <button
              key={tf.value}
              onClick={() => setPeriod(tf.value)}
              disabled={chartUpdating}
              className={`px-3 py-1 text-xs rounded transition
                ${
                  period === tf.value
                    ? "bg-blue-500 text-white"
                    : "bg-slate-800 text-gray-300 hover:bg-slate-700"
                }`}
            >
              {tf.label}
            </button>
          ))}
        </div>

        {/* CHART WRAPPER */}

        <div className="relative">
          {chartUpdating && (
            <div className="absolute top-2 right-2 text-xs text-gray-400 z-10">
              Updating chart...
            </div>
          )}

          <CandlestickChart
            data={candles}
            signals={signal?.trades}
            timeframe={period}
            showRSI={true}
            showMetrics={true}
          />
        </div>
      </div>

      {/* SIGNAL PANEL */}

      <div className="lg:col-span-3 order-2 lg:order-3">
        <SignalPanel data={signal} ticker={ticker} />
      </div>

      {/* AI EXPLANATION */}

      <div className="lg:col-span-7 order-3 lg:order-4">
        <AIExplanation explanation={signal?.explanation} />
      </div>

      {/* ANALYTICS */}

      <div className="lg:col-span-3 order-4 lg:order-5">
        <AnalyticsPanel equity={signal?.equity_curve} />
      </div>

      {/* SECTOR HEATMAP */}

      <div className="lg:col-span-12 order-6 mt-6">
        <div className="bg-slate-900 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-200 mb-4">
            Sector Heatmap
          </h2>

          {Object.keys(heatmap).map((sector) => (
            <div key={sector} className="mb-6">
              <h3 className="text-sm text-gray-400 mb-2">{sector}</h3>

              <SectorHeatmap data={heatmap[sector]} setTicker={setTicker} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
