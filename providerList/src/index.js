import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import App from './components/App';

// import { createStore, applyMiddleware, compose } from 'redux';
// import reduxThunk from 'redux-thunk';

// import reducers from './reducers';

// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// const store = createStore(
//   reducers,
//   composeEnhancers(applyMiddleware(reduxThunk))
// );

const rootReducer = combineReducers({
  form: formReducer
});

const store = createStore(rootReducer);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector('#root')
);
