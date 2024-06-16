import { combineReducers } from 'redux';
import authReducer from './auth';
import questionsReducer from './questions';
import notificationsReducer from './notifications';
import currentUserReducer from "./currentUser";
import usersReducer from "./users";

export default combineReducers({
  authReducer,
  currentUserReducer,
  questionsReducer,
  usersReducer,
  notificationsReducer,
});
