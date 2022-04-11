import { ADD_CATEGORY, DELETE_CATEGORY, EDIT_CATEGORY, GET_CATEGORIES, GET_CATEGORY, } from "../actions/actionsTypes";

let initialState = {
  categories:[],
  category:{},
  loading:true
}


const categoriesReducer = (state=initialState, action)=>{
  switch (action.type) {

    case ADD_CATEGORY:
      return{
        ...state,
        categories:[...state.categories, action.payload ]
      }



    case EDIT_CATEGORY:
      return{
        ...state,
        categories:state.categories.map(category=>
          category._id === action.payload.id?action.payload.data:category
          ),
          loading:false
      }


    case GET_CATEGORIES:
      return{
        ...state,
        categories:action.payload,
        loading:false
      }

    case GET_CATEGORY:
        return{
          ...state,
          category:action.payload
        }



    case DELETE_CATEGORY:
      return{
        ...state,
        categories:state.categories.filter(category=>category._id !== action.payload)
      }

    default:
      return state
  }
}

export default categoriesReducer;