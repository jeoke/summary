import React from 'react';
import ReactDom from 'react-dom';
import {BrowserRouter, Route} from 'react-router-dom';
import { Provider } from 'react-redux';
import { getClientStore } from '../store/store.js';
import routes from '../route.js';
import { renderRoutes } from 'react-router-config';
const App = () => {
  return (
    <Provider store={getClientStore()}>
      <BrowserRouter>
        {renderRoutes(routes)}
      </BrowserRouter>
    </Provider>
  )
}

ReactDom.hydrate(<App />, document.getElementById('root'))
