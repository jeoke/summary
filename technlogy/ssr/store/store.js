import { createStore, applyMiddleware ,combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { reducer as homeReducer } from '../client/containers/Home/store/index.js';
import clientAxios from '../client/request.js';
import serverAxios from '../dist/request.js';


const reducers = combineReducers({
	home:homeReducer
})
const getClientStore = () => {
  const defaultState = window.context ? window.context.state : {};
  return createStore(reducers,defaultState,applyMiddleware(thunk.withExtraArgument(clientAxios)));
} 
const getServerStore = () => {
  return createStore(reducers,{}, applyMiddleware(thunk.withExtraArgument(serverAxios)));
}

export { getClientStore,getServerStore };