import { DELETE_PRODUCT, GET_PRODUCT, GET_PRODUCTS } from "../actions/actionsTypes";

let initialState = {
  products:[],
  product:{},
  loading:true,
  productsCount:''
}


const productsReducer = (state=initialState, action)=>{
  switch (action.type) {
    case GET_PRODUCTS:
      return{
        ...state,
        productsCount:action.payload.count,
        products:action.payload.data,
        loading:false
      }
      

    case DELETE_PRODUCT:
      return{
        ...state,
        products:state.products.filter(product=>product._id !== action.payload)
      }
      


    case GET_PRODUCT:
      return{
        ...state,
        product:action.payload,
        loading:false
      }
      

    default:
      return state
      
  }
}

export default productsReducer;