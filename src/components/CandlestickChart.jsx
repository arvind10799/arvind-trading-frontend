import { useEffect, useRef, useState } from "react";
import {
  createChart,
  CandlestickSeries,
  HistogramSeries,
  LineSeries,
  CrosshairMode,
} from "lightweight-charts";

export default function CandlestickChart({
  data,
  timeframe = "1Y",
  showRSI = false,
  compareData,
  signals = [],
}) {
  const chartContainerRef = useRef(null);

  const chartRef = useRef(null);
  const candleSeriesRef = useRef(null);
  const smaSeriesRef = useRef(null);
  const volumeSeriesRef = useRef(null);
  const rsiSeriesRef = useRef(null);
  const compareSeriesRef = useRef(null);

  const [metrics, setMetrics] = useState({
    price: null,
    rsi: null,
    sma: null,
    volume: null,
    trend: null,
  });

  // Remove duplicates + convert timestamp
  const cleanData = (arr) => {
    if (!arr) return [];

    const map = new Map();

    arr.forEach((item) => {
      map.set(item.time, {
        ...item,
        time: Math.floor(new Date(item.time).getTime() / 1000),
      });
    });

    return Array.from(map.values()).sort((a, b) => a.time - b.time);
  };

  // ---------------- CREATE CHART ----------------

  useEffect(() => {
    const container = chartContainerRef.current;

    const chart = createChart(container, {
      width: container.clientWidth,
      height: container.clientHeight,

      layout: {
        background: { color: "#020617" },
        textColor: "#CBD5F5",
      },

      grid: {
        vertLines: { color: "#1e293b" },
        horzLines: { color: "#1e293b" },
      },

      crosshair: {
        mode: CrosshairMode.Normal,
      },

      rightPriceScale: {
        borderColor: "#334155",
      },

      timeScale: {
        borderColor: "#334155",
        timeVisible: true,
      },
    });

    chartRef.current = chart;

    // CANDLES
    candleSeriesRef.current = chart.addSeries(CandlestickSeries, {
      upColor: "#22c55e",
      downColor: "#ef4444",
      borderUpColor: "#22c55e",
      borderDownColor: "#ef4444",
      wickUpColor: "#22c55e",
      wickDownColor: "#ef4444",
    });

    // SMA
    smaSeriesRef.current = chart.addSeries(LineSeries, {
      color: "#f59e0b",
      lineWidth: 2,
    });

    // VOLUME
    volumeSeriesRef.current = chart.addSeries(HistogramSeries, {
      priceFormat: { type: "volume" },
      priceScaleId: "",
    });

    volumeSeriesRef.current.priceScale().applyOptions({
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });

    // CROSSHAIR METRICS
    chart.subscribeCrosshairMove((param) => {
      if (!param.seriesPrices) return;

      const price = param.seriesPrices.get(candleSeriesRef.current);

      if (!price) return;

      setMetrics((prev) => ({
        ...prev,
        price: price.close?.toFixed(2),
      }));
    });

    // RESIZE
    const handleResize = () => {
      chart.applyOptions({
        width: container.clientWidth,
        height: container.clientHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, []);

  // ---------------- UPDATE DATA ----------------

  useEffect(() => {
    if (!data || !data.candles) return;

    const candles = cleanData(data.candles);
    const sma = cleanData(data.sma);
    const volume = cleanData(data.volume);
    const rsi = cleanData(data.rsi);

    candleSeriesRef.current.setData(candles);
    smaSeriesRef.current.setData(sma);
    volumeSeriesRef.current.setData(volume);

    // RSI
    if (showRSI && rsi) {
      if (!rsiSeriesRef.current) {
        rsiSeriesRef.current = chartRef.current.addSeries(LineSeries, {
          color: "#a855f7",
          lineWidth: 2,
          priceScaleId: "rsi",
        });

        chartRef.current.priceScale("rsi").applyOptions({
          scaleMargins: {
            top: 0.75,
            bottom: 0,
          },
        });
      }

      rsiSeriesRef.current.setData(rsi);
    }

    // SIGNAL MARKERS
    if (signals.length > 0) {
      const markers = signals.map((s) => ({
        time: Math.floor(new Date(s.time).getTime() / 1000),
        position: s.type === "buy" ? "belowBar" : "aboveBar",
        color: s.type === "buy" ? "#22c55e" : "#ef4444",
        shape: s.type === "buy" ? "arrowUp" : "arrowDown",
        text: s.type.toUpperCase(),
      }));

      candleSeriesRef.current.setMarkers(markers);
    }

    // COMPARE SYMBOL
    if (compareData && compareData.candles) {
      if (!compareSeriesRef.current) {
        compareSeriesRef.current = chartRef.current.addSeries(LineSeries, {
          color: "#38bdf8",
          lineWidth: 2,
        });
      }

      const compareClean = cleanData(compareData.candles).map((c) => ({
        time: c.time,
        value: c.close,
      }));

      compareSeriesRef.current.setData(compareClean);
    }

    chartRef.current.timeScale().fitContent();

    // METRICS PANEL
    const lastCandle = candles[candles.length - 1];
    const lastRSI = rsi?.[rsi.length - 1]?.value;
    const lastSMA = sma?.[sma.length - 1]?.value;
    const lastVolume = volume?.[volume.length - 1]?.value;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMetrics((prev) => ({
      ...prev,
      price: lastCandle?.close?.toFixed(2),
      rsi: lastRSI?.toFixed(2),
      sma: lastSMA?.toFixed(2),
      volume: lastVolume?.toLocaleString(),
      trend: lastSMA && lastCandle?.close > lastSMA ? "Bullish" : "Bearish",
    }));
  }, [data]);

  return (
    <div className="relative bg-slate-900 border border-slate-800 rounded-xl p-2 h-[350px] md:h-[450px] lg:h-[550px]">
      {/* METRICS PANEL */}

      <div className="absolute top-2 left-2 z-20 bg-slate-950/70 backdrop-blur-md border border-slate-700 px-3 py-2 rounded text-xs text-gray-300 space-y-1">
        <div className="font-semibold text-white">TF: {timeframe}</div>

        <div>Price: {metrics.price}</div>

        <div>RSI: {metrics.rsi}</div>

        <div>SMA20: {metrics.sma}</div>

        <div>Volume: {metrics.volume}</div>

        <div
          className={
            metrics.trend === "Bullish" ? "text-green-400" : "text-red-400"
          }
        >
          Trend: {metrics.trend}
        </div>
      </div>

      {/* CHART */}

      <div ref={chartContainerRef} className="w-full h-full relative z-0" />
    </div>
  );
}
