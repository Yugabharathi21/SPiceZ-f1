import React from 'react';

const ErrorFallback: React.FC = () => {
  return (
    <div style={{
      padding: '20px',
      maxWidth: '600px',
      margin: '40px auto',
      backgroundColor: '#1F1F27',
      border: '1px solid #38383F',
      borderRadius: '8px',
      color: '#F0F0F5'
    }}>
      <h2 style={{
        color: '#E10600',
        fontWeight: 'bold',
        marginBottom: '10px'
      }}>Something went wrong</h2>
      
      <p style={{ marginBottom: '20px' }}>
        We encountered an error while loading the application. Please try refreshing the page.
      </p>
      
      <button 
        onClick={() => window.location.reload()}
        style={{
          backgroundColor: '#E10600',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Refresh Page
      </button>
    </div>
  );
};

export default ErrorFallback;
