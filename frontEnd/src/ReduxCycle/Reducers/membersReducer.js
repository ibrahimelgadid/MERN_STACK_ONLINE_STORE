import { DELETE_USER, GET_USER, GET_USERS } from "../actions/actionsTypes";

let initialState = {
  users:[],
  user:{},
  loading:true
}


const membersReducer = (state=initialState, action)=>{
  switch (action.type) {
    case GET_USERS:
      return{
        ...state,
        users:action.payload,
        loading:false
      }
      

    case DELETE_USER:
      return{
        ...state,
        users:state.users.filter(user=>user._id !== action.payload)
      }
      


    case GET_USER:
      return{
        ...state,
        user:action.payload,
        loading:false
      }
      

    default:
      return state
      
  }
}

export default membersReducer;