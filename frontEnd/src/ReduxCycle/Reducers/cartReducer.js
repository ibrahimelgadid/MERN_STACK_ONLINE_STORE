import { GET_CART, PRODUCT_DEC, PRODUCT_DELETE, PRODUCT_INC} from "../actions/actionsTypes";

let initialState = {
  cart:{},
  selectedProduct:[],
  loading:true
}


const cartReducer = (state=initialState, action)=>{
  switch (action.type) {
    case GET_CART:
      return{
        ...state,
        cart:action.payload,
        selectedProduct:action.payload.selectedProduct,
        loading:false
      }

      case PRODUCT_INC:
        return{
          ...state,
          cart:action.payload.data,
          selectedProduct:state.selectedProduct.map((pro,i)=>i===action.payload.index?action.payload.data.selectedProduct[action.payload.index]:pro)
        }


      case PRODUCT_DEC:
        return{
          ...state,
          cart:action.payload.data,
          selectedProduct:state.selectedProduct.map((pro,i)=>i===action.payload.index?action.payload.data.selectedProduct[action.payload.index]:pro)
        }

        case PRODUCT_DELETE:
          return{
            ...state,
            cart:action.payload.data,
            selectedProduct:state.selectedProduct.filter((pro,i)=>i!==action.payload.index)
          }


    default:
      return state

  } 
}

export default cartReducer;