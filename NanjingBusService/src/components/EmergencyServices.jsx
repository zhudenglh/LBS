import React, { useState } from 'react';
import EmergencyServicesDetail from './EmergencyServicesDetail';
import '../styles/EmergencyServices.css';

const EmergencyServices = ({ services }) => {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <>
      <div className="emergency-services">
        <div className="section-header">
          <div className="header-left">
            <span className="header-icon">🚨</span>
            <span className="header-title">应急服务</span>
            <span className="header-subtitle">（下车即达）</span>
          </div>
          <button className="more-btn" onClick={() => setShowDetail(true)}>
            查看更多 →
          </button>
        </div>

        <div className="services-grid">
          {services.map((service) => (
            <div key={service.id} className="service-card">
              <div className="service-icon">{service.icon}</div>
              <div className="service-info">
                <div className="service-name">{service.name}</div>
                <div className="service-distance">
                  <span className="distance-value">{service.distance}</span>
                  <span className="walk-time">步行{service.walkTime}</span>
                </div>
                <div className="service-status">{service.status}</div>
              </div>
              <button className="navigate-btn">导航</button>
            </div>
          ))}
        </div>
      </div>

      {showDetail && <EmergencyServicesDetail onClose={() => setShowDetail(false)} />}
    </>
  );
};

export default EmergencyServices;
