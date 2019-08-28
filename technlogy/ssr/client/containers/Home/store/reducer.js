import { CHANGE_LIST } from "./constants";

const defaultState = {
  name: 'ssr',
  list: []
}

export default (state = defaultState, action) => {
  switch(action.type) {
    case CHANGE_LIST:
      const newState = {
        ...state,
        list: action.list
      }
      console.log(newState)
      return newState
    default:
      return state;
  }
}

