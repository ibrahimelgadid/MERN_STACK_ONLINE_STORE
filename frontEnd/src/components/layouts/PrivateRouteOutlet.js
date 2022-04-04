import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";

function PrivateRouteOutlet({ children }) {
  let {isAuthenticated} = useSelector(state=>state.authReducer)
  const auth = isAuthenticated;
  if (auth) {
    return <Outlet />
  }else{
    console.log(';;;;');
    toast.warn('You are not authorized, Please login', {theme:"colored"})
    return <Navigate to="/login" />
  }
    
}

export default PrivateRouteOutlet;