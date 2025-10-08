import React, { useState } from 'react';
import '../styles/TransferInfo.css';

const TransferInfo = ({ transferInfo }) => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="transfer-info">
      <div className="section-header">
        <span className="header-icon">🚇</span>
        <span className="header-title">换乘信息</span>
        <span className="header-subtitle">（{transferInfo.nextStation}站）</span>
      </div>

      {/* 地铁换乘 */}
      <div className="transfer-section">
        <div className="transfer-card metro-card">
          <div className="card-header">
            <span className="card-icon">🚇</span>
            <span className="card-title">可换乘地铁</span>
          </div>
          <div className="metro-lines">
            {transferInfo.metro.map((metro, index) => (
              <div key={index} className="metro-item">
                <div className="metro-line-badge">{metro.line}</div>
                <div className="metro-details">
                  <span className="next-train">{metro.nextTrain}</span>
                  <span className="direction">{metro.direction}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 公交换乘 */}
      <div className="transfer-section">
        <div
          className="transfer-card bus-card"
          onClick={() => toggleSection('bus')}
        >
          <div className="card-header">
            <span className="card-icon">🚌</span>
            <span className="card-title">可换乘公交</span>
            <span className="expand-icon">
              {expandedSection === 'bus' ? '▲' : '▼'}
            </span>
          </div>
          {expandedSection === 'bus' && (
            <div className="bus-routes">
              {transferInfo.bus.map((bus, index) => (
                <div key={index} className="bus-item">
                  <span className="bus-route">{bus.route}</span>
                  <span className="bus-info">{bus.info}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 共享单车 */}
      <div className="transfer-section">
        <div
          className="transfer-card bike-card"
          onClick={() => toggleSection('bike')}
        >
          <div className="card-header">
            <span className="card-icon">🚲</span>
            <span className="card-title">共享单车</span>
            <span className="expand-icon">
              {expandedSection === 'bike' ? '▲' : '▼'}
            </span>
          </div>
          {expandedSection === 'bike' && (
            <div className="bike-brands">
              {transferInfo.bike.map((bike, index) => (
                <div key={index} className="bike-item">
                  <span className="bike-brand">{bike.brand}</span>
                  <span className="bike-count">附近有{bike.count}辆</span>
                  <span className="bike-status">{bike.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransferInfo;
