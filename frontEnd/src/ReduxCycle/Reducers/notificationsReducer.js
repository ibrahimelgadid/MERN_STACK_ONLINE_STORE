import { ADD_NOTIFY, DELETE_NOTIFIIES, DELETE_NOTIFIY, GET_NOTIFIES } from "../actions/actionsTypes";

let initialState = {
  notifications:[],
  loading:true
}


const notificationsReducer = (state=initialState, action)=>{
  switch (action.type) {

    case ADD_NOTIFY:
      return{
        ...state,
        notifications:[action.payload,...state.notifications]
      }


    case DELETE_NOTIFIY:
      return{
        ...state,
        notifications:state.notifications.filter(noty=>noty._id !== action.payload)
      }

    case GET_NOTIFIES:
      return{
        ...state,
        notifications:action.payload,
        loading:false
      }


    case DELETE_NOTIFIIES:
      return{
        ...state,
        notifications:[]
      }



    default:
      return state
  }
}

export default notificationsReducer;