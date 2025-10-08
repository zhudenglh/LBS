import React from 'react';
import '../styles/StationProgress.css';

const StationProgress = ({ busData, stations }) => {
  return (
    <div className="station-progress-container">
      {/* 到站提醒卡片 */}
      <div className="arrival-alert">
        <div className="alert-icon">🔔</div>
        <div className="alert-content">
          <div className="alert-title">
            已开启 "{busData.nextStation}" 下车提醒
          </div>
          <div className="alert-subtitle">
            还有{busData.stationsRemaining}站(约{busData.estimatedTime}分钟)
          </div>
        </div>
      </div>

      {/* 站点进度条 */}
      <div className="stations-timeline">
        <div className="timeline-header">
          <span className="station-name left">{stations[0]?.name}</span>
          <span className="station-name center">{stations[2]?.name}</span>
          <span className="station-name right">{stations[4]?.name}</span>
        </div>

        <div className="timeline-track">
          {stations.map((station, index) => (
            <React.Fragment key={index}>
              {/* 线段 */}
              {index > 0 && (
                <div
                  className={`timeline-segment ${
                    station.passed ? 'passed' :
                    station.current ? 'current' : 'upcoming'
                  }`}
                />
              )}

              {/* 站点圆点 */}
              <div
                className={`timeline-dot ${
                  station.passed ? 'passed' :
                  station.current ? 'current' : 'upcoming'
                }`}
              >
                {station.current && <div className="pulse-ring" />}
              </div>
            </React.Fragment>
          ))}
        </div>

        <div className="timeline-footer">
          <span className="footer-label">{stations[3]?.name}</span>
          <span className="footer-label current-label">{busData.currentStation}</span>
        </div>
      </div>

      {/* 下一站信息 */}
      <div className="next-station-info">
        <div className="info-icon">📍</div>
        <span className="info-text">下一站·{busData.nextStation} 附近优惠</span>
      </div>
    </div>
  );
};

export default StationProgress;
