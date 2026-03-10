import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import MainLayout from "./layouts/MainLayout";

function App() {
  const [ticker, setTicker] = useState("RELIANCE");

  const stocks = [
    "RELIANCE",
    "TCS",
    "INFY",
    "ICICIBANK",
    "SBIN",
    "ITC",
    "BAJFINANCE",
    "HDFCBANK",
  ];

  return (
    <MainLayout stocks={stocks} setTicker={setTicker}>
      <Dashboard ticker={ticker} setTicker={setTicker} />
    </MainLayout>
  );
}

export default App;
