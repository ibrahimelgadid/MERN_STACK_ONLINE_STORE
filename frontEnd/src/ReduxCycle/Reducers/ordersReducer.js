import { GET_ORDERS, DELETE_ORDER, GET_ORDER } from "../actions/actionsTypes";

let initialState = {
  orders:[],
  order:{},
  loading:true
}


const ordersReducer = (state=initialState, action)=>{
  switch (action.type) {

    case GET_ORDERS:
      return{
        ...state,
        orders:action.payload,
        loading:false
      }


    case GET_ORDER:
      return{
        ...state,
        order:action.payload,
        loading:false
      }


    case DELETE_ORDER:
        return{
          ...state,
          orders:state.orders.filter(order=>order._id !== action.payload),
          loading:false
        }

    default:
    return state;

    }
}

export default ordersReducer;