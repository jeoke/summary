import React from 'react';
import {Route} from 'react-router-dom'
import Home from './client/containers/Home/Home.js';
import Login from './client/containers/Login/Login.js'
import App from './App.js'
export default [{
  path:'/',
  component:App,
  routes: [{
    path:'/',
    component:Home,
    exact:true,
    loadData:Home.loadData,
    key:'home'
  },
  {
    path:'/login',
    component:Login,
    exact:true,
    key:'login'
  }]
}]


