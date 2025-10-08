import React from 'react';
import BusHeader from './components/BusHeader';
import StationProgress from './components/StationProgress';
import EmergencyServices from './components/EmergencyServices';
import TransferInfo from './components/TransferInfo';
import OfferCards from './components/OfferCards';
import { busData, stations, emergencyServices, transferInfo, offers } from './data/mockData';
import './App.css';

function App() {
  return (
    <div className="app">
      <div className="app-container">
        {/* 公交头部 */}
        <BusHeader busData={busData} />

        {/* 到站提醒和线路进度 */}
        <StationProgress busData={busData} stations={stations} />

        {/* 应急服务 */}
        <EmergencyServices services={emergencyServices} />

        {/* 换乘信息 */}
        <TransferInfo transferInfo={transferInfo} />

        {/* 优惠推荐 */}
        <OfferCards offers={offers} />
      </div>
    </div>
  );
}

export default App;
