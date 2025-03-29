export const fetchPriceData = async () => {
    return {
      currentPrice: 63179.71,
      changeAmount: 2161.42,
      changePercentage: 3.54,
      isPositive: true,
      chartData: [
        { time: '00:00', price: 62100 },
        { time: '04:00', price: 62500 },
        { time: '08:00', price: 63200 },
        { time: '12:00', price: 62900 },
        { time: '16:00', price: 63400 },
        { time: '20:00', price: 63179 },
      ]
    };
  };