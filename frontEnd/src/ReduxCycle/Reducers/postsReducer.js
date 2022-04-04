import { ADD_POSTS, DELETE_POST, EDIT_POST, GET_POST, GET_POSTS } from "../actions/actionsTypes";

let initialState = {
  posts:[],
  post:{},
  loading:true
}


const membersReducer = (state=initialState, action)=>{
  switch (action.type) {
    case GET_POSTS:
      return{
        ...state,
        posts:action.payload,
        loading:false
      }

    case GET_POST:
      return{
        ...state,
        post:action.payload
      }

    case ADD_POSTS:
      return{
        ...state,
        posts:[action.payload,...state.posts]
      }
      

    case DELETE_POST:
      return{
        ...state,
        posts:state.posts.filter(post=>post._id !== action.payload)
      }
      


    case EDIT_POST:
      return{
        ...state,
        posts:state.posts.map(post=>post._id === action.payload.postID?
          action.payload.data:post
          )
      }
      

    default:
      return state
      
  }
}

export default membersReducer;