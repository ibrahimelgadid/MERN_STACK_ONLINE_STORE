import { createStore, applyMiddleware,combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from "redux-thunk";
import membersReducer from './Reducers/membersReducer';
import authReducer from './Reducers/authReducer';
import errorsReducer from './Reducers/errorsReducer';
import productsReducer from './Reducers/productsReducer';
import categoriesReducer from "./Reducers/categoriesReducer";
import brandsReducer from './Reducers/brandsReducer';
import cartReducer from './Reducers/cartReducer';
import ordersReducer from './Reducers/ordersReducer';
import postsReducer from './Reducers/postsReducer';
import notificationsReducer from './Reducers/notificationsReducer'




const reducers = combineReducers({
  authReducer, 
  errorsReducer,
  membersReducer,
  productsReducer,
  categoriesReducer,
  brandsReducer,
  cartReducer,
  ordersReducer,
  postsReducer,
  notificationsReducer
});

const initialState = {};
const middleware = [thunk];




export const store = createStore(
  reducers,
  initialState,
  composeWithDevTools(
    applyMiddleware(...middleware)
  )
);

export default store;