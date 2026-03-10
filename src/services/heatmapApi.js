import axios from "axios";

//const API = "http://localhost:8000";
const API = "https://arvind-trading-backend.onrender.com";

export const getSectorHeatmap = async () => {
  const res = await axios.get(`${API}/heatmap/sector-heatmap`);
  return res.data;
};
