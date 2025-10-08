import React from 'react';
import '../styles/OfferCards.css';

const OfferCards = ({ offers }) => {
  return (
    <div className="offer-cards">
      <div className="section-header">
        <span className="header-icon">🎁</span>
        <span className="header-title">附近优惠</span>
        <span className="header-subtitle">（智能推荐）</span>
      </div>

      <div className="offers-container">
        {offers.map((offer) => (
          <div key={offer.id} className="offer-card">
            <div className="offer-image">
              <div className="offer-emoji">{offer.image}</div>
            </div>

            <div className="offer-content">
              <div className="offer-header">
                <h3 className="offer-title">{offer.title}</h3>
                <span className="offer-distance">{offer.distance}</span>
              </div>

              <p className="offer-subtitle">{offer.subtitle}</p>

              <div className="offer-tags">
                {offer.tags.map((tag, index) => (
                  <span key={index} className="offer-tag">{tag}</span>
                ))}
                <span className="offer-sales">半年售 {offer.sales}</span>
              </div>

              <div className="offer-footer">
                <div className="price-section">
                  <span className="current-price">{offer.price}</span>
                  <span className="original-price">{offer.originalPrice}</span>
                  <span className="discount-badge">{offer.discount}</span>
                </div>
                <button className="buy-button">抢购</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="view-more">
        <button className="view-more-btn">查看更多优惠</button>
      </div>
    </div>
  );
};

export default OfferCards;
