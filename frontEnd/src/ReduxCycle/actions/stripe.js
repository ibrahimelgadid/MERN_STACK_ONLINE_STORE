import axios from 'axios';
import { toast } from 'react-toastify';
import { GET_ERRORS } from './actionsTypes';



export const handleStripeToken = (stripeData)=>(dispatch)=>{
  axios.post('http://localhost:5000/stripe/pay', stripeData)
    .then(res=>{
        toast.success('Payment has been successed', {theme:'colored'})
      })

    .catch(err=>{
      dispatch({
        type:GET_ERRORS,
        payload:err.response.data
      })
    })
}

