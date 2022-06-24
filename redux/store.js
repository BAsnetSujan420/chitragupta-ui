import { createStore, applyMiddleware, compose } from "redux"
import thunk from "redux-thunk"
import { createWrapper } from "next-redux-wrapper"
import reducers from './reducers'

let composeEnhancers = compose
if (typeof window !== 'undefined') {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
}
const middleware = [thunk]

const store = () => createStore(reducers, composeEnhancers(applyMiddleware(...middleware)))

export const wrapper = createWrapper(store)
