import { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import {
  ArrowUpward,
  Fullscreen,
  BarChart,
  Close,
} from "@mui/icons-material";
import { 
  Tabs,
  Tab,
  Button,
  Box,
  Typography,
  Paper,
  Dialog,
} from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const generateBTCData = (timeframe) => {
  let labels = [];
  let data = [];
  
  const baseValue = 60000;
  const randomFactor = () => Math.random() * 2000;
  
  switch(timeframe) {
    case '1d':
      labels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
      data = labels.map((_, i) => baseValue + Math.sin(i/3) * 5000 + randomFactor());
      break;
    case '3d':
      labels = Array.from({ length: 72 }, (_, i) => 
        `Day ${Math.floor(i/24)+1} ${i%24}:00`
      );
      data = labels.map((_, i) => baseValue + Math.sin(i/10) * 8000 + randomFactor());
      break;
    case '1w':
      labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      data = [62000, 63500, 64000, 63000, 62500, 61000, 61500];
      break;
    case '1m':
      labels = Array.from({ length: 30 }, (_, i) => `Day ${i+1}`);
      data = labels.map((_, i) => baseValue + Math.sin(i/5) * 10000 + randomFactor());
      break;
    case '6m':
      labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      data = [58000, 62000, 65000, 63000, 64000, 67000];
      break;
    case '1y':
      labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      data = [42000, 45000, 48000, 52000, 58000, 64000, 62000, 60000, 58000, 62000, 65000, 68000];
      break;
    case 'max':
      labels = ['2020', '2021', '2022', '2023'];
      data = [10000, 35000, 45000, 63000];
      break;
    default:
      labels = Array.from({ length: 24 }, (_, i) => i.toString());
      data = labels.map((_, i) => baseValue + Math.sin(i/3) * 3000 + randomFactor());
  }

  return { labels, data };
};

const generateETHData = (timeframe) => {
  const btcData = generateBTCData(timeframe);
  return {
    labels: btcData.labels,
    data: btcData.data.map(value => value * 0.06)
  };
};

export default function CryptoPriceChart() {
  const [timeframe, setTimeframe] = useState("1w");
  const [tabValue, setTabValue] = useState("chart");
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  
  const btcData = generateBTCData(timeframe);
  const ethData = generateETHData(timeframe);
  
  const chartData = {
    labels: btcData.labels,
    datasets: [
      {
        label: "BTC",
        data: btcData.data,
        borderColor: "rgb(79, 70, 229)",
        backgroundColor: "rgba(79, 70, 229, 0.1)",
        tension: 0.3,
        fill: true,
      },
      ...(compareMode ? [{
        label: "ETH",
        data: ethData.data,
        borderColor: "rgb(56, 139, 253)",
        backgroundColor: "rgba(56, 139, 253, 0.1)",
        tension: 0.3,
        fill: true,
      }] : [])
    ],
  };

  const currentPrice = btcData.data.slice(-1)[0];
  const previousPrice = btcData.data[0];
  const priceChange = currentPrice - previousPrice;
  const percentChange = ((priceChange / previousPrice) * 100).toFixed(2);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: compareMode,
        position: 'top',
      },
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          label: (context) => 
            `${context.dataset.label}: $${context.parsed.y.toLocaleString()}`
        }
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        grid: { color: "rgba(0, 0, 0, 0.05)" },
        ticks: { callback: (value) => `$${value.toLocaleString()}` }
      }
    },
    interaction: { mode: "nearest", axis: "x", intersect: false },
  };

  const timeframes = ["1d", "3d", "1w", "1m", "6m", "1y", "max"];
  const tabs = ["summary", "chart", "statistics", "analysis", "settings"];

  const renderContent = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, height: '100%' }}>
      {/* Header Section */}
      <Box>
        <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
          {currentPrice.toLocaleString('en-US', { 
            style: 'decimal', 
            minimumFractionDigits: 2 
          })}
          <Typography component="span" sx={{ fontSize: '1rem', color: 'text.secondary', ml: 1 }}>
            USD
          </Typography>
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          color: priceChange >= 0 ? 'success.main' : 'error.main',
          fontWeight: 'medium' 
        }}>
          <ArrowUpward sx={{ 
            fontSize: '1rem', 
            mr: 0.5,
            transform: priceChange < 0 ? 'rotate(180deg)' : 'none' 
          }} />
          {Math.abs(priceChange).toLocaleString('en-US', { 
            style: 'decimal', 
            minimumFractionDigits: 2 
          })} ({Math.abs(percentChange)}%)
        </Box>
      </Box>

      <Tabs 
        value={tabValue}
        onChange={(_, newValue) => setTabValue(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          mb: 3,
          bgcolor: 'grey.100',
          borderRadius: 1,
          p: 0.5,
          '& .MuiTabs-indicator': {
            backgroundColor: 'primary.main',
            height: 2
          },
          '& .MuiTabs-flexContainer': {
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)'
          }
        }}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab}
            value={tab}
            label={tab.charAt(0).toUpperCase() + tab.slice(1)}
            sx={{
              textTransform: 'capitalize',
              borderRadius: 1,
              '&.Mui-selected': {
                bgcolor: 'background.paper',
                boxShadow: 1,
                color: 'primary.main',
                fontWeight: 'fontWeightBold'
              }
            }}
          />
        ))}
      </Tabs>

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center'
      }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant="outlined" 
            startIcon={<Fullscreen />}
            onClick={() => setFullscreenOpen(!fullscreenOpen)}
          >
            Fullscreen
          </Button>
          <Button
            variant="outlined"
            startIcon={<BarChart />}
            onClick={() => setCompareMode(!compareMode)}
            color={compareMode ? 'primary' : 'inherit'}
          >
            {compareMode ? 'Stop Compare' : 'Compare'}
          </Button>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {timeframes.map((tf) => (
            <Button
              key={tf}
              variant="outlined"
              size="small"
              onClick={() => setTimeframe(tf)}
              sx={{
                minWidth: 48,
                ...(timeframe === tf && {
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': { bgcolor: 'primary.dark' }
                })
              }}
            >
              {tf}
            </Button>
          ))}
        </Box>
      </Box>

      <Box sx={{ position: 'relative', height: 400, width: '100%' }}>
        <Line data={chartData} options={options} />
        <Box sx={{ 
          position: 'absolute', 
          top: 8, 
          right: 8, 
          bgcolor: 'grey.900', 
          color: 'white', 
          px: 1, 
          py: 0.5, 
          borderRadius: 1, 
          fontSize: '0.875rem' 
        }}>
          {Math.max(...btcData.data).toLocaleString('en-US', { 
            minimumFractionDigits: 2 
          })}
        </Box>
        <Box sx={{ 
          position: 'absolute', 
          bottom: 8, 
          right: 8, 
          bgcolor: 'primary.main', 
          color: 'white', 
          px: 1, 
          py: 0.5, 
          borderRadius: 1, 
          fontSize: '0.875rem' 
        }}>
          {currentPrice.toLocaleString('en-US', { 
            minimumFractionDigits: 2 
          })}
        </Box>
      </Box>

    </Box>
  );

  return (
    <>
      <Paper sx={{ 
        maxWidth: 1200,
        mx: 'auto', 
        p: 3, 
        borderRadius: 2, 
        boxShadow: 3 
      }}>
        {renderContent()}
      </Paper>

      <Dialog
        fullScreen
        open={fullscreenOpen}
        onClose={() => setFullscreenOpen(false)}
        PaperProps={{ sx: { overflow: 'hidden' } }}
      >
        <Box sx={{ 
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          p: 3,
          overflow: 'hidden'
        }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            mb: 2
          }}>
            <Typography variant="h5">
              Crypto Price Chart - {timeframe.toUpperCase()}
            </Typography>
            <Button
              variant="contained"
              onClick={() => setFullscreenOpen(false)}
              startIcon={<Close />}
            >
              Exit
            </Button>
          </Box>
          
          <Paper sx={{ 
            flex: 1,
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            <Box sx={{ 
              height: '100%',
              overflow: 'auto',
              '&::-webkit-scrollbar': { display: 'none' }
            }}>
              {renderContent()}
            </Box>
          </Paper>
        </Box>
      </Dialog>
    </>
  );
}