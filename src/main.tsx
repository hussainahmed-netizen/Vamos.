import React, { StrictMode, Component, ReactNode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';

const RAW_KEY =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ||
  (import.meta.env as any).NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

const isClerkErrorString = (str: string): boolean => {
  if (!str) return false;
  const s = String(str).toLowerCase();
  return (
    s.includes('clerk') ||
    s.includes('attribute') ||
    s.includes('publishable key') ||
    s.includes('accounts.dev') ||
    s.includes('helpful-pelican') ||
    s.includes('isomorphicclerk')
  );
};

let globalClerkFailed = false;
const clerkListeners: Array<() => void> = [];

const notifyClerkFailed = () => {
  globalClerkFailed = true;
  clerkListeners.forEach((fn) => {
    try {
      fn();
    } catch {
      // ignore
    }
  });
};

const handleGlobalError = (event: ErrorEvent) => {
  const msg = (event.message || '') + ' ' + (event.filename || '') + ' ' + (event.error?.stack || '');
  if (isClerkErrorString(msg)) {
    console.warn('Intercepted and suppressed Clerk global error:', event.message);
    try {
      event.preventDefault();
      event.stopImmediatePropagation();
    } catch {
      // ignore
    }
    notifyClerkFailed();
  }
};

const handleGlobalRejection = (event: PromiseRejectionEvent) => {
  const reasonObj = event.reason;
  const reasonMsg = reasonObj?.message || String(reasonObj || '');
  const stack = reasonObj?.stack || '';
  const msg = reasonMsg + ' ' + stack;
  if (isClerkErrorString(msg)) {
    console.warn('Intercepted and suppressed Clerk global promise rejection:', reasonMsg);
    try {
      event.preventDefault();
      event.stopImmediatePropagation();
    } catch {
      // ignore
    }
    notifyClerkFailed();
  }
};

if (typeof window !== 'undefined') {
  window.addEventListener('error', handleGlobalError, true);
  window.addEventListener('unhandledrejection', handleGlobalRejection, true);

  const originalConsoleError = console.error;
  console.error = function (...args) {
    const msg = args.map((a) => (typeof a === 'string' ? a : (a && a.message) ? a.message : String(a))).join(' ');
    if (isClerkErrorString(msg)) {
      console.warn('Intercepted and suppressed Clerk console.error:', msg);
      notifyClerkFailed();
      return;
    }
    originalConsoleError.apply(console, args);
  };
}

const isValidPublishableKey = (key?: string): boolean => {
  if (!key || typeof key !== 'string') return false;
  const trimmed = key.trim();
  if (!trimmed.startsWith('pk_test_') && !trimmed.startsWith('pk_live_')) return false;
  if (trimmed.length <= 20) return false;
  try {
    const b64 = trimmed.split('_')[2] || trimmed.split('_')[1];
    const decoded = atob(b64);
    if (decoded.includes('vamos') || decoded.includes('pelican') || decoded.includes('vercel.app')) {
      return false;
    }
  } catch (e) {
    // ignore
  }
  return true;
};

interface ClerkBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface ClerkBoundaryState {
  hasError: boolean;
}

class ClerkErrorBoundary extends Component<ClerkBoundaryProps, ClerkBoundaryState> {
  declare props: ClerkBoundaryProps;
  declare state: ClerkBoundaryState;

  constructor(props: ClerkBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn('ClerkProvider error caught in ClerkErrorBoundary:', error, errorInfo);
    notifyClerkFailed();
  }

  render() {
    if (this.state.hasError || globalClerkFailed) {
      return <>{this.props.fallback}</>;
    }
    return <>{this.props.children}</>;
  }
}

const SafeClerkWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [clerkFailed, setClerkFailed] = useState(globalClerkFailed);

  useEffect(() => {
    if (globalClerkFailed) {
      setClerkFailed(true);
      return;
    }
    const listener = () => setClerkFailed(true);
    clerkListeners.push(listener);
    return () => {
      const idx = clerkListeners.indexOf(listener);
      if (idx !== -1) clerkListeners.splice(idx, 1);
    };
  }, []);

  const validKey = isValidPublishableKey(RAW_KEY) ? RAW_KEY!.trim() : null;

  if (!validKey || clerkFailed || globalClerkFailed) {
    return <>{children}</>;
  }

  return (
    <ClerkErrorBoundary fallback={children}>
      <ClerkProvider publishableKey={validKey}>
        {children}
      </ClerkProvider>
    </ClerkErrorBoundary>
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



