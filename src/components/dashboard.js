import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Area, ResponsiveContainer } from 'recharts';
import { fetchPriceData } from '../services/priceService';
import './dashboard.css';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">{`$${payload[0].value.toLocaleString()}`}</p>
        <p className="time">{payload[0].payload.time}</p>
      </div>
    );
  }
  return null;
};

const PriceDashboard = () => {
  const [activeTab, setActiveTab] = useState('Summary');
  const [timeRange, setTimeRange] = useState('1d');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const tabs = ['Summary', 'Chart', 'Statistics', 'Analysis', 'Settings'];
  const timeRanges = ['1d', '1w', '1m', '3m', '6m', '1y', 'max'];

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchPriceData();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!data) return <div className="error">No data available</div>;

  return (
    <div className="dashboard-container">
      <div className="price-header">
        <div className="price-display">
          <h1 className="current-price">{data.currentPrice.toLocaleString()} USD</h1>
          <div className={`price-change ${data.isPositive ? 'positive' : 'negative'}`}>
            {data.isPositive ? '+' : ''}{data.changeAmount.toLocaleString()} ({data.changePercentage}%)
          </div>
        </div>
      </div>

      <div className="dashboard-tabs">
        {tabs.map(tab => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="chart-controls">
        <div className="chart-buttons-left">
          <button className="control-button">Fullscreen</button>
          <button className="control-button">Compare</button>
        </div>
        <div className="time-range-buttons">
          {timeRanges.map(range => (
            <button
              key={range}
              className={`time-button ${timeRange === range ? 'active' : ''}`}
              onClick={() => setTimeRange(range)}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data.chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4b40ee" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#4b40ee" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="time" />
            <YAxis domain={['auto', 'auto']} />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke="#4b40ee" 
              fillOpacity={1} 
              fill="url(#colorPrice)" 
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#4b40ee" 
              strokeWidth={2} 
              dot={false} 
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="price-indicator high">64,850.35</div>
        <div className="price-indicator current">{data.currentPrice.toLocaleString()}</div>
      </div>
    </div>
  );
};

export default PriceDashboard;