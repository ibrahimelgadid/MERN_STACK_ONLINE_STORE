import isEmpty from "../../utilis/isEmpty";
import { SET_CURRENT_USER } from "../actions/actionsTypes";

let initialState = {
  user: {},
  isAuthenticated: false,
  userData: {},
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !isEmpty(action.payload),
      };

    default:
      return state;
  }
};

export default authReducer;
