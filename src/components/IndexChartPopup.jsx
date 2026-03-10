// import { useEffect, useState } from "react";
// import { getCandles } from "../services/api";
// import CandlestickChart from "./CandlestickChart";

// export default function IndexChartPopup({ ticker, onClose }) {
//   const [mainChart, setMainChart] = useState(null);
//   const [compareChart, setCompareChart] = useState(null);
//   const [compareSymbol, setCompareSymbol] = useState("");

//   const [period, setPeriod] = useState("1y");
//   const [loading, setLoading] = useState(true);
//   const [showRSI, setShowRSI] = useState(false);
//   const [layout, setLayout] = useState("single");

//   const timeframes = [
//     { label: "1D", value: "1d" },
//     { label: "5D", value: "5d" },
//     { label: "1M", value: "1mo" },
//     { label: "6M", value: "6mo" },
//     { label: "1Y", value: "1y" },
//   ];

//   // MAIN CHART FETCH
//   useEffect(() => {
//     const fetchMainChart = async () => {
//       try {
//         setLoading(true);

//         const res = await getCandles(ticker, period);

//         setMainChart(res.data);
//       } catch (err) {
//         console.error("Chart fetch error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMainChart();
//   }, [ticker, period]);

//   // COMPARE CHART FETCH
//   const handleCompare = async () => {
//     if (!compareSymbol) return;

//     try {
//       const res = await getCandles(compareSymbol.toUpperCase(), period);

//       setCompareChart(res.data);

//       setLayout("double");
//     } catch (err) {
//       console.error("Compare fetch error:", err);
//     }
//   };

//   const removeCompare = () => {
//     setCompareChart(null);

//     setCompareSymbol("");

//     setLayout("single");
//   };

//   return (
//     <div
//       className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
//       onClick={onClose}
//     >
//       <div
//         className="bg-slate-900 w-[1200px] max-w-[95vw] h-[700px] rounded-xl border border-slate-700 flex flex-col"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* HEADER */}

//         <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
//           <div className="flex items-center gap-4">
//             <h2 className="text-lg font-semibold text-white">{ticker}</h2>

//             <div className="flex gap-2">
//               {timeframes.map((tf) => (
//                 <button
//                   key={tf.value}
//                   onClick={() => setPeriod(tf.value)}
//                   className={`px-3 py-1 text-xs rounded
//                   ${
//                     period === tf.value
//                       ? "bg-blue-500 text-white"
//                       : "bg-slate-800 text-gray-300 hover:bg-slate-700"
//                   }`}
//                 >
//                   {tf.label}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-red-400"
//           >
//             ✕
//           </button>
//         </div>

//         {/* TOOLBAR */}

//         <div className="flex items-center justify-between px-6 py-2 border-b border-slate-800">
//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => setShowRSI(!showRSI)}
//               className={`px-3 py-1 rounded text-sm
//               ${
//                 showRSI
//                   ? "bg-purple-600 text-white"
//                   : "bg-slate-800 text-gray-300"
//               }`}
//             >
//               RSI
//             </button>
//           </div>

//           {/* COMPARE TOOL */}

//           <div className="flex items-center gap-2">
//             <input
//               placeholder="Compare (RELIANCE)"
//               value={compareSymbol}
//               onChange={(e) => setCompareSymbol(e.target.value)}
//               className="bg-slate-800 px-3 py-1 rounded text-sm outline-none"
//             />

//             <button
//               onClick={handleCompare}
//               className="bg-blue-500 px-3 py-1 text-sm rounded hover:bg-blue-600"
//             >
//               Add
//             </button>

//             {compareChart && (
//               <button
//                 onClick={removeCompare}
//                 className="bg-red-500 px-3 py-1 text-sm rounded hover:bg-red-600"
//               >
//                 Remove
//               </button>
//             )}
//           </div>
//         </div>

//         {/* CHART AREA */}

//         <div className="flex-1 p-4">
//           {loading ? (
//             <div className="flex items-center justify-center h-full">
//               <div className="w-10 h-10 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
//             </div>
//           ) : layout === "single" ? (
//             <CandlestickChart data={mainChart} showRSI={showRSI} />
//           ) : (
//             <div className="grid grid-cols-2 gap-4 h-full">
//               <CandlestickChart data={mainChart} showRSI={showRSI} />

//               <CandlestickChart data={compareChart} showRSI={showRSI} />
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { getCandles } from "../services/api";
import CandlestickChart from "./CandlestickChart";

export default function IndexChartPopup({ ticker, onClose }) {
  const [mainChart, setMainChart] = useState(null);
  const [compareChart, setCompareChart] = useState(null);

  const [compareSymbol, setCompareSymbol] = useState("");

  const [period, setPeriod] = useState("1y");
  const [loading, setLoading] = useState(true);

  const [showRSI, setShowRSI] = useState(false);
  const [layout, setLayout] = useState("single");

  const timeframes = [
    { label: "1D", value: "1d" },
    { label: "5D", value: "5d" },
    { label: "1M", value: "1mo" },
    { label: "6M", value: "6mo" },
    { label: "1Y", value: "1y" },
  ];

  /* MAIN CHART FETCH */

  useEffect(() => {
    const fetchMainChart = async () => {
      try {
        setLoading(true);

        const res = await getCandles(ticker, period);

        setMainChart(res?.data || []);
      } catch (err) {
        console.error("Chart fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMainChart();
  }, [ticker, period]);

  /* RESET COMPARE WHEN TICKER CHANGES */

  useEffect(() => {
    setCompareChart(null);
    setCompareSymbol("");
    setLayout("single");
  }, [ticker]);

  /* COMPARE FETCH */

  const handleCompare = async () => {
    if (!compareSymbol.trim()) return;

    try {
      const symbol = compareSymbol.toUpperCase();

      const res = await getCandles(symbol, period);

      if (!res?.data || res.data.length === 0) {
        alert("Symbol not found");
        return;
      }

      setCompareChart(res.data);
      setLayout("double");
    } catch (err) {
      console.error("Compare fetch error:", err);
    }
  };

  const removeCompare = () => {
    setCompareChart(null);
    setCompareSymbol("");
    setLayout("single");
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 w-[1200px] max-w-[95vw] h-[700px] rounded-xl border border-slate-700 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}

        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-white">{ticker}</h2>

            {/* TIMEFRAMES */}

            <div className="flex gap-2">
              {timeframes.map((tf) => (
                <button
                  key={tf.value}
                  onClick={() => setPeriod(tf.value)}
                  className={`px-3 py-1 text-xs rounded
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
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-400"
          >
            ✕
          </button>
        </div>

        {/* TOOLBAR */}

        <div className="flex items-center justify-between px-6 py-2 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowRSI(!showRSI)}
              className={`px-3 py-1 rounded text-sm
              ${
                showRSI
                  ? "bg-purple-600 text-white"
                  : "bg-slate-800 text-gray-300"
              }`}
            >
              RSI
            </button>
          </div>

          {/* COMPARE */}

          <div className="flex items-center gap-2">
            <input
              placeholder="Compare (RELIANCE)"
              value={compareSymbol}
              onChange={(e) => setCompareSymbol(e.target.value)}
              className="bg-slate-800 px-3 py-1 rounded text-sm outline-none"
            />

            <button
              onClick={handleCompare}
              className="bg-blue-500 px-3 py-1 text-sm rounded hover:bg-blue-600"
            >
              Add
            </button>

            {compareChart && (
              <button
                onClick={removeCompare}
                className="bg-red-500 px-3 py-1 text-sm rounded hover:bg-red-600"
              >
                Remove
              </button>
            )}
          </div>
        </div>

        {/* CHART AREA */}

        <div className="flex-1 p-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-10 h-10 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          ) : layout === "single" ? (
            <CandlestickChart data={mainChart} showRSI={showRSI} />
          ) : (
            <div className="grid grid-cols-2 gap-4 h-full">
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 mb-1">{ticker}</span>
                <CandlestickChart data={mainChart} showRSI={showRSI} />
              </div>

              <div className="flex flex-col">
                <span className="text-xs text-gray-400 mb-1">
                  {compareSymbol}
                </span>
                <CandlestickChart data={compareChart} showRSI={showRSI} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
