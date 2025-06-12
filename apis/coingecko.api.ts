import axios from "axios";

const API_BASE_URL = "https://api.coingecko.com/api/v3";

export const fetchMarketData = async () => {
  const response = await axios.get(`${API_BASE_URL}/coins/markets`, {
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

export const fetchCoinDetail = async (coinId: string) => {
  const response = await axios.get(`${API_BASE_URL}/coins/${coinId}`, {
    params: {
      localization: false,
      tickers: false,
      market_data: true,
      community_data: false,
      developer_data: false,
      sparkline: false,
    },
  });

  return {
    id: response.data.id,
    symbol: response.data.symbol,
    name: response.data.name,
    image: response.data.image.large,
    current_price: response.data.market_data.current_price.usd,
    market_cap: response.data.market_data.market_cap.usd,
    total_volume: response.data.market_data.total_volume.usd,
    high_24h: response.data.market_data.high_24h.usd,
    low_24h: response.data.market_data.low_24h.usd,
    price_change_percentage_24h:
      response.data.market_data.price_change_percentage_24h,
  };
};

export const fetchCoinMarketChart = async (coinId: string, days = 7) => {
  const response = await axios.get(
    `${API_BASE_URL}/coins/${coinId}/market_chart`,
    {
      params: {
        vs_currency: "usd",
        days: days,
        interval: "daily",
      },
    }
  );

  return response.data.prices.map(
    ([timestamp, price]: [number, number]) => ({
      date: new Date(timestamp).toLocaleDateString(),
      price,
    })
  );
};