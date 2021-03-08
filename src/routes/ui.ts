import { Router } from 'express';

const isProduction = process.env['NODE_ENV'] == 'production';

export function ui() {
  const router = Router();

  if (isProduction) {
    const mainJS = '';
    const mainCSS = '';

    router.get('*', (_, res) => {
      res.send(`<!DOCTYPE html><html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Warp Drive</title>
      </head>
      <body>
        <div id="root"></div>
        <div id="slide-over"></div>
        <link rel="stylesheet" href="${mainJS}" />
        <script type="module" src="${mainCSS}"></script>
      </body>
      </html>`);
    });
  } else {
    router.get('*', (_, res) => {
      res.send(`<!DOCTYPE html><html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Warp Drive</title>
      </head>
      <body>
        <div id="root"></div>
        <div id="slide-over"></div>
        <script type="module">
          import RefreshRuntime from "http://localhost:3000/@react-refresh"
          RefreshRuntime.injectIntoGlobalHook(window) 
          window.$RefreshReg$ = () => {}
          window.$RefreshSig$ = () => (type) => type
          window.__vite_plugin_react_preamble_installed__ = true
        </script>
        <script type="module" src="http://localhost:3000/@vite/client"></script>
        <script type="module" src="http://localhost:3000/src/main.tsx"></script>
      </body>
      </html>`);
    });
  }

  return router;
}
