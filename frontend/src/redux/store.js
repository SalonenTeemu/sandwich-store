import { legacy_createStore, combineReducers, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import orderReducer from "./reducers/orderReducer.js";
import notificationReducer from "./reducers/notificationReducer.js";
import sandwichReducer from "./reducers/sandwichReducer.js";
import userReducer from "./reducers/userReducer";
import authReducer from "./reducers/authReducer";
import utilReducer from "./reducers/utilReducer.js";

// Redux-devtools extension library
import { composeWithDevTools } from "@redux-devtools/extension";

export const reducers = combineReducers({
  orders: orderReducer,
  notifications: notificationReducer,
  sandwiches: sandwichReducer,
  users: userReducer,
  auth: authReducer,
  utils: utilReducer,
});

export default legacy_createStore(
  reducers,
  composeWithDevTools(applyMiddleware(thunk))
);
