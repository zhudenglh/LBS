import React from 'react';
import '../styles/BusHeader.css';

const BusHeader = ({ busData }) => {
  return (
    <div className="bus-header">
      {/* 公交车顶部图片 */}
      <div className="bus-image-container">
        <div className="bus-image">
          <div className="bus-illustration">🚌</div>
        </div>
        <div className="wifi-button">
          <span className="wifi-icon">📶</span>
          <span className="wifi-text">连公交WiFi</span>
        </div>
      </div>

      {/* 路线信息 */}
      <div className="route-info">
        <div className="route-number">
          <span className="bus-icon">🚌</span>
          <span className="number">{busData.routeNumber}</span>
        </div>
        <div className="route-name">{busData.routeName}</div>
      </div>

      {/* 方向信息 */}
      <div className="route-direction">
        {busData.direction}
      </div>
    </div>
  );
};

export default BusHeader;
