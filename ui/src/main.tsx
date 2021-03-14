import 'vite/dynamic-import-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import { IntlProvider } from 'react-intl';

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
      <IntlProvider locale="en-GB" onError={() => {}}>
        <App />
      </IntlProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
