"use client";

import React from 'react';

export default function FloatingDashboard() {
  return (
    <>
      {/* Ye rahi hamari Floating Animation ki CSS */}
      <style>{`
        @keyframes smoothFloat {
          0% { transform: translateY(0px); box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.05); }
          50% { transform: translateY(-12px); box-shadow: 0px 15px 25px rgba(0, 0, 0, 0.12); }
          100% { transform: translateY(0px); box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.05); }
        }
        .floating-card {
          animation: smoothFloat 4s ease-in-out infinite;
        }
        .delay-1 { animation-delay: 0s; }
        .delay-2 { animation-delay: 0.5s; }
        .delay-3 { animation-delay: 1s; }
        .floating-card:hover { animation-play-state: paused; }
      `}</style>

      {/* Dashboard UI */}
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', padding: '20px', flexWrap: 'wrap' }}>
        
        {/* Card 1 */}
        <div className="floating-card delay-1" style={cardStyle}>
          <h4 style={{ margin: 0, color: '#6c757d', fontSize: '15px', fontWeight: 'normal' }}>Total Revenue</h4>
          <h2 style={{ margin: '10px 0 5px 0', color: '#212529', fontSize: '28px' }}>₹85,000</h2>
          <p style={{ margin: 0, color: '#28a745', fontSize: '13px', fontWeight: 'bold' }}>+15% this week</p>
        </div>

        {/* Card 2 */}
        <div className="floating-card delay-2" style={cardStyle}>
          <h4 style={{ margin: 0, color: '#6c757d', fontSize: '15px', fontWeight: 'normal' }}>Active Users</h4>
          <h2 style={{ margin: '10px 0 5px 0', color: '#212529', fontSize: '28px' }}>1,240</h2>
          <p style={{ margin: 0, color: '#28a745', fontSize: '13px', fontWeight: 'bold' }}>+8% this week</p>
        </div>

        {/* Card 3 */}
        <div className="floating-card delay-3" style={cardStyle}>
          <h4 style={{ margin: 0, color: '#6c757d', fontSize: '15px', fontWeight: 'normal' }}>Conversion Rate</h4>
          <h2 style={{ margin: '10px 0 5px 0', color: '#212529', fontSize: '28px' }}>4.2%</h2>
          <p style={{ margin: 0, color: '#28a745', fontSize: '13px', fontWeight: 'bold' }}>+1.5% this week</p>
        </div>

      </div>
    </>
  );
}

// Cards ka basic design
const cardStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  padding: '25px',
  width: '200px',
  textAlign: 'center' as const,
  cursor: 'pointer',
  border: '1px solid #e5e7eb'
};