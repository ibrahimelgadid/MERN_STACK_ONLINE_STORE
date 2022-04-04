import React, {useEffect} from 'react'
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";



function PrivateRoute({ children }) {
  let {isAuthenticated} = useSelector(state=>state.authReducer)
  const auth = isAuthenticated;
  var warning = false;
  useEffect(() => {
    if(warning){
      toast.warn('You are not authorized, Please login', {theme:"colored"})
    }
    
  })

  if (auth) {
    return children
  }else{
    return (warning=true,<Navigate to="/login" />)
  }
    
}

export default PrivateRoute;