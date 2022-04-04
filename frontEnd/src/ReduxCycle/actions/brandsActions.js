import axios from 'axios';
import { toast } from 'react-toastify';
import { CLEAR_ERRORS, GET_ERRORS, EDIT_BRAND, GET_BRAND, DELETE_BRAND, ADD_BRAND, GET_BRANDS } from './actionsTypes';



export const addNewBrand = (brandData,)=>(dispatch)=>{
 dispatch( clearErrors());
  axios.post('http://localhost:5000/brands', brandData)
    .then(res=>{
      dispatch({
        type:ADD_BRAND,
        payload:res.data
      })
        toast.success('New brand has been added', {theme:'colored'})
      })

    .catch(err=>{
      dispatch({
        type:GET_ERRORS,
        payload:err.response.data
      })
    })
}


export const editBrand = (brandData, id)=>(dispatch)=>{
  dispatch( clearErrors());
  axios.put('http://localhost:5000/brands/'+id, brandData)
    .then(res=>{
      dispatch({
        type:EDIT_BRAND,
        payload:{id:id, data:res.data}
      })
        toast.success('brand has been edited', {theme:'colored'})
      })
    .catch(err=>{
      dispatch({
        type:GET_ERRORS,
        payload:err.response.data
      })
    })
}

export const getBrands = ()=>(dispatch)=>{
  axios.get('http://localhost:5000/brands')
    .then(res=>{
        dispatch({
          type:GET_BRANDS,
          payload:res.data
        })
      })

    .catch(err=>{
      dispatch({
        type:GET_BRANDS,
        payload:[]
      })
    })
}

export const getBrand = (brand_id)=>(dispatch)=>{
  axios.get('http://localhost:5000/brands/'+brand_id)
    .then(res=>{
        dispatch({
          type:GET_BRAND,
          payload:res.data
        })
      })

    .catch(err=>{
      dispatch({
        type:GET_BRAND,
        payload:{}
      })
    })
}




export const deleteBrand = (brand_id)=>(dispatch)=>{
  axios.delete('http://localhost:5000/brands/'+brand_id)
    .then(res=>{
        toast.success('brand has been deleted', {theme:'colored'})
        dispatch({
          type:DELETE_BRAND,
          payload:brand_id
        })
      })

    .catch(err=>{
      dispatch({
        type:DELETE_BRAND,
        payload:err.response.data
      })
    })
}



export const clearErrors = ()=>{
  return{
    type:CLEAR_ERRORS
  }
}