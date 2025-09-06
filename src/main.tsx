import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import ErrorFallback from './components/ErrorFallback.tsx'
import './index.css'

// Register error handler
window.onerror = (message, source, lineno, colno, error) => {
  console.error('Global error:', { message, source, lineno, colno, error });
  
  // Hide fallback loader if it exists
  const fallbackLoader = document.querySelector('.fallback-loader');
  if (fallbackLoader) {
    fallbackLoader.remove();
  }
  
  return false;
};

// Create a custom error boundary wrapper
class AppErrorBoundary extends React.Component<{children: React.ReactNode}> {
  state = { hasError: false };
  
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("App crashed:", error, errorInfo);
    
    // Hide fallback loader if it exists
    const fallbackLoader = document.querySelector('.fallback-loader');
    if (fallbackLoader) {
      fallbackLoader.remove();
    }
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}

// Remove the fallback loader once React has loaded
document.addEventListener('DOMContentLoaded', () => {
  const fallbackLoader = document.querySelector('.fallback-loader');
  if (fallbackLoader) {
    setTimeout(() => {
      fallbackLoader.remove();
    }, 300); // Short delay to ensure smooth transition
  }
});

const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(
    <AppErrorBoundary>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </AppErrorBoundary>
  );
}
