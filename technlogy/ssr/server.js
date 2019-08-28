const webpack = require('webpack');
const webpackSer = require('./webpack.server.js');
const compiler = webpack(webpackSer);
const middleware = require('webpack-dev-middleware');
const hotMiddleware = require("webpack-hot-middleware");
const instance = middleware(compiler);
const express = require('express')
const app = express();
import proxy from 'express-http-proxy';
app.use(hotMiddleware(compiler));
app.use(express.static('./statics'));

app.use('/api', proxy('http://localhost:4000', {
  proxyReqPathResolver: function(req) {
    return req.url;
  }
}));

import React from 'react';
import { renderToString }  from 'react-dom/server';
import { render } from './dist/util.js';
import { matchRoutes } from 'react-router-config';
import routes from './route.js';
import { getServerStore } from './store/store.js';

app.get('*', function (req, res) {
   const store = getServerStore();
   const matchedRoutes = matchRoutes(routes,req.path);
   const promises = [];
   matchedRoutes.forEach(item => {
     if (item.route.loadData) {
         const promise = new Promise((resolve, reject) => {
        item.route.loadData(store).then(resolve).catch(resolve);
      })
         promises.push(promise);
     }
   });

   Promise.all(promises).then(()=>{
        let context = {css: []};
        const html = render(store,routes,req,context);
        res.send(html);
   })
});


app.listen(3000, () => console.log('Example app listening on port 3000!'))