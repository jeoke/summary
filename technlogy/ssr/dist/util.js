import Routes from '../route.js'
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom'; 
import { Provider } from 'react-redux';
import React from 'react';
import { getServerStore } from '../store/store.js';
import { renderRoutes } from 'react-router-config';
import { Helmet } from 'react-helmet';


export const render = (store,routes,req,context) => {
  const content = renderToString(
      <Provider store={store}>
      <StaticRouter location={req.path} context={context} >
        {renderRoutes(Routes)}
      </StaticRouter>
    </Provider>
  );

  const cssStr = context.css.length ? context.css.join('\n') : '';
  const helmet = Helmet.renderStatic();
  return  `
        <html>
           <head>
           <style>${cssStr}</style>
           ${helmet.title.toString()}
           ${helmet.meta.toString()}
           </head>
           <body>
             <div id="root">${content}</div>
           </body>
           <script>
              window.context = {
                state: ${JSON.stringify(store.getState())}
              }
           </script>
           <script type="text/javascript" src="/react-client-ssr.js"></script>
           <script type="text/javascript" src="/0.react-client-ssr.js"></script>
        </html>
    `
}