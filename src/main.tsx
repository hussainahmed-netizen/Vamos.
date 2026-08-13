import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';

const PUBLISHABLE_KEY =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ||
  import.meta.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
  'pk_test_JVJe3cUtnyOSELyTbQvwLPSQnpxktqQVNpoovOYNil';

const SafeClerkWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (!PUBLISHABLE_KEY) {
    return <>{children}</>;
  }

  return (
    <ErrorBoundary fallback={<>{children}</>}>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        {children}
      </ClerkProvider>
    </ErrorBoundary>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <SafeClerkWrapper>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </SafeClerkWrapper>
    </ErrorBoundary>
  </StrictMode>,
);


