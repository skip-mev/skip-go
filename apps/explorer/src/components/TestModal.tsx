import React from 'react';

export const TestModal: React.FC = () => {
  console.warn("🔍 TestModal component rendering");
  
  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      padding: '20px',
      border: '1px solid black',
      borderRadius: '8px',
      zIndex: 1000,
      minWidth: '300px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <h2>🧪 Test Modal</h2>
      <p>This is a simple test modal to verify the modal system is working.</p>
      <p>If you can see this, the basic modal infrastructure is working!</p>
      
      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <button 
          onClick={() => {
            console.warn("🔍 Test modal close button clicked");
            // Try to close using NiceModal
            if (typeof window !== 'undefined' && (window as any).NiceModal) {
              (window as any).NiceModal.hide('TestModal');
            }
          }}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Close Modal
        </button>
        
        <button 
          onClick={() => {
            console.warn("🔍 Test modal log button clicked");
            console.warn("🔍 Current NiceModal state:", (window as any).NiceModal);
          }}
          style={{
            padding: '8px 16px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Log State
        </button>
      </div>
    </div>
  );
};
