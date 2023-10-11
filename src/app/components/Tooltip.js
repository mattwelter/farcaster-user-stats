"use client"

import { useState } from 'react';

const Tooltip = ({ content, children }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = () => {
    setShowTooltip(true);
    console.log("true")
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
    console.log("false")
  };

  return (
    <div className="tooltip-container" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {children}
      {showTooltip && <div className="tooltip">{content}</div>}
      <style jsx>{`
        .tooltip-container {
          position: relative;
          display: inline-block;
        }
        .tooltip {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          background-color: #FAFAFA;
          color: #555;
          padding: 8px;
          border-radius: 4px;
          white-space: nowrap;
          z-index: 9999999;
          margin-top: 4px;
          border: 1px solid #FAFAFA;
        }

        .tooltip:before{
            content: '';
            display: block;
            width: 0;
            height: 0;
            position: absolute;

            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-bottom: 8px solid white;

            top: -8px;
            left: calc(50% - 8px);
        }
      `}</style>
    </div>
  );
};

export default Tooltip;