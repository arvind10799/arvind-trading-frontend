import MarketBar from "../components/MarketBar";

export default function MainLayout({ children, setTicker, stocks }) {
  return (
    <div className="min-h-screen bg-slate-950 text-gray-200 flex flex-col">
      {/* Sticky Market Header */}
      <div className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950">
        <MarketBar setTicker={setTicker} stocks={stocks} />
      </div>

      {/* Scrollable Content Area */}
      <main className="flex-1 overflow-y-auto p-2 md:p-4">{children}</main>
    </div>
  );
}
