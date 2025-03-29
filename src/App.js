import React from 'react';
import './App.css';
import PriceDashboard from './components/dashboard';
import CryptoPriceChart from './components/chart';

function App() {
  return (
    <div className="App">
      {/* <PriceDashboard
          price="63,179.71" 
          changeAmount="2,161.42" 
          changePercentage="3.54" 
          isPositive={true} 
      /> */}
      <CryptoPriceChart />
    </div>
  );
}

export default App;
