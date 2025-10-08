import React, { useState } from 'react';
import '../styles/EmergencyServicesDetail.css';

const EmergencyServicesDetail = ({ onClose }) => {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: '全部', icon: '📋' },
    { id: 'medical', name: '医疗健康', icon: '🏥' },
    { id: 'emergency', name: '应急救援', icon: '🚨' },
    { id: 'daily', name: '日常便利', icon: '🏪' },
    { id: 'service', name: '生活服务', icon: '🔧' },
    { id: 'government', name: '政务服务', icon: '🏛️' },
  ];

  const allServices = [
    // 医疗健康
    {
      id: 1,
      category: 'medical',
      icon: '🏥',
      name: '南京市第一医院',
      type: '三甲医院',
      distance: '450米',
      walkTime: '6分钟',
      status: '24小时急诊',
      phone: '025-52271000',
      features: ['急诊', '内科', '外科', '儿科']
    },
    {
      id: 2,
      category: 'medical',
      icon: '💊',
      name: '老百姓大药房',
      type: '连锁药店',
      distance: '200米',
      walkTime: '3分钟',
      status: '营业至22:00',
      phone: '025-83456789',
      features: ['处方药', '非处方药', '医保定点']
    },
    {
      id: 3,
      category: 'medical',
      icon: '🚑',
      name: '社区卫生服务中心',
      type: '社区医院',
      distance: '320米',
      walkTime: '4分钟',
      status: '营业中 8:00-17:30',
      phone: '025-83123456',
      features: ['全科', '中医', '康复', '体检']
    },

    // 应急救援
    {
      id: 4,
      category: 'emergency',
      icon: '🚓',
      name: '新街口派出所',
      type: '公安机关',
      distance: '380米',
      walkTime: '5分钟',
      status: '24小时值班',
      phone: '110 / 025-84457110',
      features: ['报警', '求助', '咨询']
    },
    {
      id: 5,
      category: 'emergency',
      icon: '🚒',
      name: '消防救援站',
      type: '消防机构',
      distance: '550米',
      walkTime: '7分钟',
      status: '24小时待命',
      phone: '119',
      features: ['火灾扑救', '应急救援']
    },
    {
      id: 6,
      category: 'emergency',
      icon: '🆘',
      name: 'AED自动除颤器',
      type: '急救设备',
      distance: '150米',
      walkTime: '2分钟',
      status: '可用',
      location: '地铁站A出口',
      features: ['心脏骤停急救']
    },

    // 日常便利
    {
      id: 7,
      category: 'daily',
      icon: '🏪',
      name: '罗森便利店',
      type: '24小时便利店',
      distance: '80米',
      walkTime: '1分钟',
      status: '营业中',
      phone: '025-83234567',
      features: ['零食饮料', '日用品', '热食']
    },
    {
      id: 8,
      category: 'daily',
      icon: '🚻',
      name: '公共卫生间',
      type: '公共设施',
      distance: '120米',
      walkTime: '2分钟',
      status: '24小时开放',
      features: ['无障碍', '母婴室']
    },
    {
      id: 9,
      category: 'daily',
      icon: '🏧',
      name: '中国银行ATM',
      type: '自助银行',
      distance: '90米',
      walkTime: '1分钟',
      status: '24小时服务',
      features: ['取款', '存款', '转账', '查询']
    },
    {
      id: 10,
      category: 'daily',
      icon: '☕',
      name: '瑞幸咖啡',
      type: '咖啡店',
      distance: '110米',
      walkTime: '2分钟',
      status: '营业中 7:00-22:00',
      phone: '4000-100-100',
      features: ['咖啡', '茶饮', '轻食']
    },

    // 生活服务
    {
      id: 11,
      category: 'service',
      icon: '🔧',
      name: '快修侠手机维修',
      type: '维修服务',
      distance: '250米',
      walkTime: '3分钟',
      status: '营业中 9:00-21:00',
      phone: '025-83345678',
      features: ['手机维修', '电脑维修', '上门服务']
    },
    {
      id: 12,
      category: 'service',
      icon: '💈',
      name: '星艺发型设计',
      type: '美发店',
      distance: '180米',
      walkTime: '2分钟',
      status: '营业中 10:00-20:00',
      phone: '025-83456123',
      features: ['理发', '烫染', '造型']
    },
    {
      id: 13,
      category: 'service',
      icon: '🧺',
      name: '衣之恋干洗店',
      type: '洗衣服务',
      distance: '160米',
      walkTime: '2分钟',
      status: '营业中 8:00-20:00',
      phone: '025-83567890',
      features: ['干洗', '水洗', '熨烫', '取送']
    },
    {
      id: 14,
      category: 'service',
      icon: '📦',
      name: '菜鸟驿站',
      type: '快递服务',
      distance: '95米',
      walkTime: '1分钟',
      status: '营业中 8:00-22:00',
      phone: '025-83678901',
      features: ['快递收发', '包裹寄存']
    },

    // 政务服务
    {
      id: 15,
      category: 'government',
      icon: '🏛️',
      name: '市民服务中心',
      type: '政务大厅',
      distance: '420米',
      walkTime: '6分钟',
      status: '工作日 9:00-17:00',
      phone: '025-12345',
      features: ['证件办理', '社保', '公积金', '税务']
    },
    {
      id: 16,
      category: 'government',
      icon: '📮',
      name: '中国邮政',
      type: '邮政网点',
      distance: '210米',
      walkTime: '3分钟',
      status: '营业中 8:30-17:30',
      phone: '025-83789012',
      features: ['邮寄', 'EMS', '邮政储蓄']
    },
  ];

  const filteredServices = activeCategory === 'all'
    ? allServices
    : allServices.filter(service => service.category === activeCategory);

  const handleNavigate = (service) => {
    // 这里可以调用导航功能
    console.log(`导航到: ${service.name}`);
  };

  const handleCall = (phone) => {
    if (phone) {
      window.location.href = `tel:${phone.split('/')[0].trim()}`;
    }
  };

  return (
    <div className="emergency-services-detail">
      <div className="detail-header">
        <button className="back-btn" onClick={onClose}>
          <span>←</span>
        </button>
        <h2>应急服务</h2>
        <span className="placeholder"></span>
      </div>

      <div className="category-tabs">
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`category-tab ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            <span className="tab-icon">{cat.icon}</span>
            <span className="tab-name">{cat.name}</span>
          </button>
        ))}
      </div>

      <div className="services-count">
        找到 <span className="count-number">{filteredServices.length}</span> 个服务点
      </div>

      <div className="services-list">
        {filteredServices.map(service => (
          <div key={service.id} className="service-detail-card">
            <div className="service-main">
              <div className="service-icon-large">{service.icon}</div>
              <div className="service-content">
                <div className="service-title">
                  <h3>{service.name}</h3>
                  <span className="service-type">{service.type}</span>
                </div>
                <div className="service-distance-info">
                  <span className="distance">{service.distance}</span>
                  <span className="separator">·</span>
                  <span className="walk-time">步行约{service.walkTime}</span>
                </div>
                <div className="service-status-badge">
                  <span className={`status-dot ${service.status.includes('24小时') || service.status.includes('营业中') ? 'open' : 'limited'}`}></span>
                  {service.status}
                </div>
                {service.features && (
                  <div className="service-features">
                    {service.features.map((feature, index) => (
                      <span key={index} className="feature-tag">{feature}</span>
                    ))}
                  </div>
                )}
                {service.location && (
                  <div className="service-location">📍 {service.location}</div>
                )}
              </div>
            </div>
            <div className="service-actions">
              {service.phone && (
                <button
                  className="action-btn call-btn"
                  onClick={() => handleCall(service.phone)}
                >
                  📞 拨打
                </button>
              )}
              <button
                className="action-btn navigate-btn"
                onClick={() => handleNavigate(service)}
              >
                🧭 导航
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <p>暂无相关服务</p>
        </div>
      )}
    </div>
  );
};

export default EmergencyServicesDetail;
