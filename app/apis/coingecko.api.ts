import axios from "axios";

const API_BASE_URL = "https://api.coingecko.com/api/v3";

export const fetchMarketData = async () => {
  const response = await axios.get(`${API_BASE_URL}/coins/markets0`, {
    params: {
      vs_currency: "usd",
      order: "market_cap_desc",
      per_page: 20,
      page: 1,
      sparkline: false,
    },
  });

  return response.data;
};
