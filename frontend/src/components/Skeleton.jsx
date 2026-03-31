import React from 'react';
import '../styles/index.css';

const Skeleton = ({ className, width, height, borderRadius = '4px', style }) => {
  const baseStyle = {
    width: width || '100%',
    height: height || '1em',
    borderRadius: borderRadius,
    background: 'linear-gradient(90deg, var(--ivory) 25%, var(--cream) 50%, var(--ivory) 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite linear',
    ...style
  };

  return <div className={`skeleton ${className || ''}`} style={baseStyle} />;
};

export const ArtworkSkeleton = () => (
  <div className="artwork-card" style={{ cursor: 'default' }}>
    <Skeleton height="350px" borderRadius="12px 12px 0 0" />
    <div className="artwork-info">
      <Skeleton width="40%" height="12px" style={{ marginBottom: '8px' }} />
      <Skeleton width="80%" height="24px" style={{ marginBottom: '8px' }} />
      <Skeleton width="60%" height="16px" style={{ marginBottom: '16px' }} />
      <div className="artwork-price-row">
        <Skeleton width="30%" height="28px" />
        <Skeleton width="40px" height="40px" borderRadius="50%" />
      </div>
    </div>
  </div>
);

export default Skeleton;
