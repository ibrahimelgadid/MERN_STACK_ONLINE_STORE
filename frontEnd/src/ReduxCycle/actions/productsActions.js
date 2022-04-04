import axios from 'axios';
import { toast } from 'react-toastify';
import { CLEAR_ERRORS, DELETE_PRODUCT, GET_ERRORS, GET_PRODUCT, GET_PRODUCTS } from './actionsTypes';



export const addNewProduct = (productData, navigate)=>(dispatch)=>{
 dispatch( clearErrors());
  axios.post('http://localhost:5000/products', productData)
    .then(res=>{
        toast.success('New product has been added', {theme:'colored'})
        navigate('/admin-products')
      })

    .catch(err=>{
      dispatch({
        type:GET_ERRORS,
        payload:err.response.data
      })
    })
}


export const editProduct = (productData, id, navigate)=>(dispatch)=>{
  dispatch( clearErrors());
  axios.put('http://localhost:5000/products/'+id, productData)
    .then(res=>{
        toast.success('Product has been edited', {theme:'colored'})
        navigate('/admin-products')
      })
    .catch(err=>{
      dispatch({
        type:GET_ERRORS,
        payload:err.response.data
      })
    })
}



export const getProducts = (page)=>(dispatch)=>{
  axios.get(`http://localhost:5000/products?page=${page}`)
    .then(res=>{
        dispatch({
          type:GET_PRODUCTS,
          payload:{data:res.data.products,count:res.data.count }
        })
      })

    .catch(err=>{
      dispatch({
        type:GET_PRODUCTS,
        payload:[]
      })
    })
}



export const getProductsForAdmins = ()=>(dispatch)=>{
  axios.get(`http://localhost:5000/products/admins`)
    .then(res=>{
        dispatch({
          type:GET_PRODUCTS,
          payload:{data:res.data.products,count:res.data.count }
        })
      })

    .catch(err=>{
      dispatch({
        type:GET_PRODUCTS,
        payload:[]
      })
    })
}



export const sortProducts = (sorted,num)=>(dispatch)=>{
  axios.get(`http://localhost:5000/products/sort/${sorted}/${num}?page=0`)
    .then(res=>{
        dispatch({
          type:GET_PRODUCTS,
          payload:{data:res.data.products,count:res.data.count }
        })
      })

    .catch(err=>{
      dispatch({
        type:GET_PRODUCTS,
        payload:[]
      })
    })
}


export const getProductsByCategory = (category)=>(dispatch)=>{
  axios.get('http://localhost:5000/products/category/'+category+"?page=0")
    .then(res=>{
        dispatch({
          type:GET_PRODUCTS,
          payload:{data:res.data.products,count:res.data.count }
        })
      })

    .catch(err=>{
      dispatch({
        type:GET_PRODUCTS,
        payload:[]
      })
    })
}


export const getProductsByFilter = (filterData)=>(dispatch)=>{
  axios.post('http://localhost:5000/products/filter', filterData)
    .then(res=>{
        dispatch({
          type:GET_PRODUCTS,
          payload:{data:res.data.products,count:res.data.count }
        })
      })

    .catch(err=>{
      dispatch({
        type:GET_PRODUCTS,
        payload:[]
      })
    })
}


export const getProductsBySearch = (searchData)=>(dispatch)=>{
  axios.post('http://localhost:5000/products/search?page=0', searchData)
    .then(res=>{
        dispatch({
          type:GET_PRODUCTS,
          payload:{data:res.data.products,count:res.data.count }
        })
      })

    .catch(err=>{
      dispatch({
        type:GET_PRODUCTS,
        payload:[]
      })
    })
}


export const getProductsByBrand = (brand)=>(dispatch)=>{
  axios.get('http://localhost:5000/products/brand/'+brand+'?page=0')
    .then(res=>{
        dispatch({
          type:GET_PRODUCTS,
          payload:{data:res.data.products,count:res.data.count }
        })
      })

    .catch(err=>{
      dispatch({
        type:GET_PRODUCTS,
        payload:[]
      })
    })
}

export const getProduct = (product_id)=>(dispatch)=>{
  axios.get('http://localhost:5000/products/'+product_id)
    .then(res=>{
        dispatch({
          type:GET_PRODUCT,
          payload:res.data
        })
      })

    .catch(err=>{
      dispatch({
        type:GET_PRODUCT,
        payload:{}
      })
    })
}




export const deleteProduct = (product_id)=>(dispatch)=>{
  axios.delete('http://localhost:5000/products/'+product_id)
    .then(res=>{
        toast.success('Product has been deleted', {theme:'colored'})
        dispatch({
          type:DELETE_PRODUCT,
          payload:product_id
        })
      })

    .catch(err=>{
      dispatch({
        type:GET_ERRORS,
        payload:err.response.data
      })
    })
}




export const addGallaryImages = (data ,pro_id)=>(dispatch)=>{
  axios.post(`http://localhost:5000/products/gallary/${pro_id}`, data)
    .then(res=>{
        dispatch({
          type:GET_PRODUCT,
          payload:res.data
        })
      })

    .catch(err=>{
      dispatch({
        type:GET_PRODUCTS,
        payload:[]
      })
    })
}


export const deleteGallaryImage = ( pro_id, img)=>(dispatch)=>{
  axios.delete(`http://localhost:5000/products/gallary/${pro_id}/${img}`)
    .then(res=>{
      dispatch({
        type:GET_PRODUCT,
        payload:res.data
      })
      })

    .catch(err=>{
      dispatch({
        type:GET_PRODUCTS,
        payload:[]
      })
    })
}



// clear errors
export const clearErrors = ()=>{
  return{
    type:CLEAR_ERRORS
  }
}

