import 'vite/dynamic-import-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';

import App from './App';
import './index.css';

Sentry.init({
  enabled: !!import.meta.env['VITE_SENTRY_DSN'],
  dsn: import.meta.env['VITE_SENTRY_DSN'] as string,
  release: import.meta.env['VITE_COMMIT_REF'] as string,
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
});

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
