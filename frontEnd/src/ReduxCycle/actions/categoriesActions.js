import axios from 'axios';
import { toast } from 'react-toastify';
import { ADD_CATEGORY, CLEAR_ERRORS, DELETE_CATEGORY, EDIT_CATEGORY, GET_CATEGORIES, GET_CATEGORY, GET_ERRORS } from './actionsTypes';



export const addNewCategory = (categoryData,)=>(dispatch)=>{
 dispatch( clearErrors());
  axios.post('http://localhost:5000/categories', categoryData)
    .then(res=>{
      dispatch({
        type:ADD_CATEGORY,
        payload:res.data
      })
        toast.success('New category has been added', {theme:'colored'})
      })

    .catch(err=>{
      dispatch({
        type:GET_ERRORS,
        payload:err.response.data
      })
    })
}


export const editCategory = (categoryData, id)=>(dispatch)=>{
  dispatch( clearErrors());
  axios.put('http://localhost:5000/categories/'+id, categoryData)
    .then(res=>{
      dispatch({
        type:EDIT_CATEGORY,
        payload:{id:id, data:res.data}
      })
        toast.success('Category has been edited', {theme:'colored'})
      })
    .catch(err=>{
      dispatch({
        type:GET_ERRORS,
        payload:err.response.data
      })
    })
}

export const getCategories = ()=>(dispatch)=>{
  axios.get('http://localhost:5000/categories')
    .then(res=>{
        dispatch({
          type:GET_CATEGORIES,
          payload:res.data
        })
      })

    .catch(err=>{
      dispatch({
        type:GET_CATEGORIES,
        payload:[]
      })
    })
}

export const getCategory = (category_id)=>(dispatch)=>{
  axios.get('http://localhost:5000/categories/'+category_id)
    .then(res=>{
        dispatch({
          type:GET_CATEGORY,
          payload:res.data
        })
      })

    .catch(err=>{
      dispatch({
        type:GET_CATEGORY,
        payload:{}
      })
    })
}




export const deleteCategory = (category_id)=>(dispatch)=>{
  axios.delete('http://localhost:5000/categories/'+category_id)
    .then(res=>{
        toast.success('Category has been deleted', {theme:'colored'})
        dispatch({
          type:DELETE_CATEGORY,
          payload:category_id
        })
      })

    .catch(err=>{
      dispatch({
        type:DELETE_CATEGORY,
        payload:err.response.data
      })
    })
}



export const clearErrors = ()=>{
  return{
    type:CLEAR_ERRORS
  }
}