import axios from 'axios';
import { toast } from 'react-toastify';
import { ADD_POSTS, CLEAR_ERRORS, DELETE_POST, EDIT_POST, GET_ERRORS, GET_POST, GET_POSTS } from './actionsTypes';


export const getPosts = ()=>(dispatch)=>{
  axios.get('posts')
    .then(res=>{
        dispatch({
          type:GET_POSTS,
          payload:res.data
        })
      })

    .catch(err=>{
      dispatch({
        type:GET_POSTS,
        payload:[]
      })
    })
}


export const getPost = (postID)=>(dispatch)=>{
  axios.get('posts/'+postID)
    .then(res=>{
        dispatch({
          type:GET_POST,
          payload:res.data
        })
      })

    .catch(err=>{
      dispatch({
        type:GET_POST,
        payload:{}
      })
    })
}



export const editPost = (postData,postID)=>(dispatch)=>{
  dispatch(clearErrors())
  axios.put('posts/'+postID, postData)
    .then(res=>{
        dispatch({
          type:EDIT_POST,
          payload:{data:res.data, postID}
        })
      })

    .catch(err=>{
      dispatch({
        type:GET_ERRORS,
        payload:err.response.data
      })
    })
}

export const addNewPost = (postData)=>(dispatch)=>{
  dispatch(clearErrors())
  axios.post('posts', postData)
    .then(res=>{
        dispatch({
          type:ADD_POSTS,
          payload:res.data
        })
        toast.success('New post has been added', {theme:'colored'})
      })

    .catch(err=>{
      dispatch({
        type:GET_ERRORS,
        payload:err.response.data
      })
    })
}


export const deletePost = (postID)=>(dispatch)=>{
  dispatch(clearErrors())
  axios.delete('posts/'+postID )
    .then(res=>{
        dispatch({
          type:DELETE_POST,
          payload:postID
        })
        toast.success('Post has been deleted', {theme:'colored'})
      })

    .catch(err=>{
      dispatch({
        type:GET_ERRORS,
        payload:err.response.data
      })
    })
}


export const likePost = (postID)=>(dispatch)=>{
  dispatch(clearErrors())
  axios.post('posts/like/'+postID )
    .then(res=>{
        dispatch({
          type:EDIT_POST,
          payload:{data:res.data, postID}
        })
      })

    .catch(err=>{
      dispatch({
        type:GET_ERRORS,
        payload:err.response.data
      })
    })
}


export const unLikePost = (postID)=>(dispatch)=>{
  dispatch(clearErrors())
  axios.post('posts/unlike/'+postID )
    .then(res=>{
        dispatch({
          type:EDIT_POST,
          payload:{data:res.data, postID}
        })
      })

    .catch(err=>{
      dispatch({
        type:GET_ERRORS,
        payload:err.response.data
      })
    })
}


export const addNewComment = (commentData,postID)=>(dispatch)=>{
  dispatch(clearErrors())
  axios.post('posts/comment/'+postID, commentData )
    .then(res=>{
        dispatch({
          type:EDIT_POST,
          payload:{data:res.data, postID}
        })
      })

    .catch(err=>{
      dispatch({
        type:GET_ERRORS,
        payload:err.response.data
      })
    })
}


export const deleteComment = (postID,commentID)=>(dispatch)=>{
  dispatch(clearErrors())
  axios.delete('posts/comment/'+postID+'/'+commentID)
    .then(res=>{
        dispatch({
          type:EDIT_POST,
          payload:{data:res.data, postID}
        })
        toast.success('Comment has been deleted', {theme:'colored'})
      })

    .catch(err=>{
      dispatch({
        type:GET_ERRORS,
        payload:err.response.data
      })
    })
}


export const clearErrors = ()=>{
  return{
    type:CLEAR_ERRORS,
    // payload:[]
  }
}