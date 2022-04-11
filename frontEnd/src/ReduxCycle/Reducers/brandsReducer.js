import { EDIT_BRAND, GET_BRANDS, GET_BRAND, ADD_BRAND, DELETE_BRAND } from "../actions/actionsTypes";

let initialState = {
  brands:[],
  brand:{},
  loading:true
}


const brandsReducer = (state=initialState, action)=>{
  switch (action.type) {

    case ADD_BRAND:
      return{
        ...state,
        brands:[...state.brands, action.payload ],
      }



    case EDIT_BRAND:
      return{
        ...state,
        brands:state.brands.map(brand=>
          brand._id === action.payload.id?action.payload.data:brand
          )
      }


    case GET_BRANDS:
      return{
        ...state,
        brands:action.payload,
        loading:false
      }

    case GET_BRAND:
        return{
          ...state,
          brand:action.payload,
          loading:false
        }



    case DELETE_BRAND:
      return{
        ...state,
        brands:state.brands.filter(brand=>brand._id !== action.payload)
      }

    default:
      return state
  }
}

export default brandsReducer;