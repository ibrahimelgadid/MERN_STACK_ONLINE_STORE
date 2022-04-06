import axios from 'axios';
import { toast } from 'react-toastify';
import { DELETE_USER, GET_ERRORS, GET_USER, GET_USERS } from './actionsTypes';


export const getUsers = ()=>(dispatch)=>{
  axios.get('users/all')
    .then(res=>{
        dispatch({
          type:GET_USERS,
          payload:res.data
        })
      })

    .catch(err=>{
      dispatch({
        type:GET_USERS,
        payload:[]
      })
    })
}

export const getUser = (user_id)=>(dispatch)=>{
  axios.get('users/'+user_id)
    .then(res=>{
        dispatch({
          type:GET_USER,
          payload:res.data
        })
      })

    .catch(err=>{
      dispatch({
        type:GET_USER,
        payload:{}
      })
    })
}


export const editUserRole = (roleData,user_id, navigate)=>(dispatch)=>{
  axios.put('users/role/'+user_id, roleData)
    .then(res=>{
        toast.success('User role has been changed', {theme:'colored'})
        navigate(-1)
      })

    .catch(err=>{
      dispatch({
        type:GET_ERRORS,
        payload:err.response.data
      })
    })
}


export const deleteUser = (user_id)=>(dispatch)=>{
  axios.delete('users/'+user_id)
    .then(res=>{
        toast.success('User has been deleted', {theme:'colored'})
        dispatch({
          type:DELETE_USER,
          payload:user_id
        })
      })

    .catch(err=>{
      dispatch({
        type:GET_ERRORS,
        payload:err.response.data
      })
    })
}
