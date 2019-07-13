import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import authReducers from './authReducers';

export default combineReducers({
  form: formReducer,
  auth: authReducers
});
