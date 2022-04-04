import React, {useEffect} from 'react'
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { bindActionCreators } from 'redux';
import { getCartElements } from '../../ReduxCycle/actions/cartActions';
import isEmpty from '../../utilis/isEmpty';



function PrivateRoute({ children }) {
  let {isAuthenticated} = useSelector(state=>state.authReducer)
  let {cart} = useSelector(state=>state.cartReducer)
  let dispatch = useDispatch()
  let GetCart = bindActionCreators(getCartElements,dispatch)
  const auth = isAuthenticated;
  var warning = false;

  useEffect(()=>{
    GetCart()
    // eslint-disable-next-line
  },[])
  useEffect(() => {
    if(warning){
      toast.warn('You are not authorized, Please login', {theme:"colored"})
    }
    
  })

  if (auth) {
    if(!isEmpty(cart)&&cart.totalQty>0){
      <Navigate to="/cart" />
    }
    return children
  }else{
    return (warning=true,<Navigate to="/login" />)
  }
    
}

export default PrivateRoute;