// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:8000",
// });

// export const getSignal = async (ticker, period) => {
//   const res = await API.get(`/signal?ticker=${ticker}&period=${period}`);
//   return res.data;
// };

// export const getCandels = async (ticker, period) => {
//   const res = await API.get(`/candels?ticker=${ticker}&period=${period}`);
//   return res.data;
//

import axios from "axios";

//const API = "http://localhost:8000";
const API = "https://arvind-trading-backend.onrender.com";

export const getSignal = (ticker, period) =>
  axios.get(`${API}/signal?ticker=${ticker}&period=${period}`);

export const getCandles = (ticker, period) =>
  axios.get(`${API}/candles?ticker=${ticker}&period=${period}`);
