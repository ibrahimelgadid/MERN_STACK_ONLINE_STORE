import React, {useEffect} from 'react'
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";



function AdminPrivateRoute({ children }) {
  const {isAuthenticated, user} = useSelector(state=>state.authReducer)
  const auth = isAuthenticated && user.role !=="user";

  var warning = false;
  useEffect(() => {
    if(warning){
      toast.warn('You are not have admin privileges', {theme:"colored"})
    }
    
  })

  if (auth) {
    return children
  }else{
    return (warning=true,<Navigate to="/" />)
  }
    
}

export default AdminPrivateRoute;