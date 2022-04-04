

import { Route, Routes } from "react-router-dom";
import Header from "./components/layouts/Header";
import NotFound from './components/layouts/NotFound'

import Register from './components/auth/Register'
import Login from "./components/auth/Login";
import Footer from "./components/layouts/Footer";
import TopMenu from "./components/layouts/TopMenu";
import { ToastContainer } from "react-toastify";
import store from "./ReduxCycle/store";
import { SET_CURRENT_USER } from "./ReduxCycle/actions/actionsTypes";
import setTokenInHeaders from "./utilis/setTokenInHeaders";
import jwtDecode from "jwt-decode";
import Profile from "./components/profile/Profile";
import PrivateRoute from "./components/layouts/PrivateRoute";
import EditProfile from "./components/profile/EditProfile";
import { logOut } from "./ReduxCycle/actions/authActions";
import Email from "./components/auth/Email";
import ResetPassword from "./components/auth/ResetPassword";
import AdminHeader from "./adminComponents/layouts/AdminHeader";
import { useSelector } from "react-redux";
import isEmpty from "./utilis/isEmpty";
import AdminSideBar from "./adminComponents/layouts/AdminSideBar";
import AdminFooter from "./adminComponents/layouts/AdminFooter";
import AdminArea from "./adminComponents/layouts/AdminArea";
import AdminPrivateRoute from "./adminComponents/layouts/AdminPrivateRoute";
import AllUsers from "./adminComponents/users/AllUsers";
import User from "./adminComponents/users/User";
import Role from "./adminComponents/users/Role";
import AddProduct from "./adminComponents/products/AddProduct";
import AllProducts from "./adminComponents/products/AllProducts";
import Product from "./adminComponents/products/Product";
import EditProduct from "./adminComponents/products/EditProduct";
import AllCategories from "./adminComponents/categories/AllCategories";
import AllBrands from "./adminComponents/brands/AllBrands";
import Market from "./components/market/Market";
import MarketP from "./components/market/Product";
import Cart from "./components/market/Cart";
import CheckOut from "./components/market/checkout/CheckOut";
import Orders from "./components/market/Orders";
import Forum from "./components/forum/Forum";


import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import './App.css';
import AllOrders from "./adminComponents/orders/AllOrders";
import Order from "./adminComponents/orders/Order";
import Verify from "./components/auth/Verify";


let token = localStorage.token;
if(token){
  setTokenInHeaders(token)
  let decoded = jwtDecode(token);
  store.dispatch({
    type:SET_CURRENT_USER,
    payload:decoded
  })

  // Check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logOut());
    // Clear current Profile
    // Redirect to login
    window.location.href = '/login';
  }
}


function App() {

  let {user} = useSelector(state=>state.authReducer);

  let admin = (!isEmpty(user) && user.role==='admin')||
              (!isEmpty(user) && user.role==='superAdmin'?true:false);

  
  
  return (
    <div className="wrapper">
      <ToastContainer/>
            
      {admin&&window.location.pathname.includes('admin')?<AdminHeader/>:<Header/>}
      {admin&&window.location.pathname.includes('admin')?<AdminSideBar/>:<TopMenu/>}
    
        <Routes>
          {/* User Area */}
          <Route path='/' element={<Market/>}/>
          <Route path='/product/:productID' element={<MarketP/>}/>
          <Route path='/cart' element={<Cart/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/verify' element={<Verify/>}/>
          <Route path='*' element={<NotFound/>}/>
          <Route path='/reset-password/:token/:email' element={<ResetPassword/>}/>
          <Route path='/email' element={<Email/>}/>
          <Route path='/forum' element={<Forum/>}/>
          <Route path='/category/:categoryHandle' element={<Market/>}/>
          <Route path='/brand/:brandHandle' element={<Market/>}/>

          <Route path='/profile' element={<PrivateRoute><Profile/></PrivateRoute>}/>
          <Route path='/edit-profile' element={<PrivateRoute><EditProfile/></PrivateRoute>}/>
          <Route path='/checkout' element={<PrivateRoute><CheckOut/></PrivateRoute>}/>
          <Route path='/orders' element={<PrivateRoute><Orders/></PrivateRoute>}/>

          {/* Admin Area */}
          <Route path='/admin-area' element={<AdminPrivateRoute><AdminArea/></AdminPrivateRoute>}/>
          <Route path='/admin-users' element={<AdminPrivateRoute><AllUsers/></AdminPrivateRoute>}/>
          <Route path='/admin-users/:user_id' element={<AdminPrivateRoute><User/></AdminPrivateRoute>}/>
          <Route path='/admin-users/role/:user_id' element={<AdminPrivateRoute><Role/></AdminPrivateRoute>}/>
          <Route path='/admin-products' element={<AdminPrivateRoute><AllProducts/></AdminPrivateRoute>}/>
          <Route path='/admin-add-product' element={<AdminPrivateRoute><AddProduct/></AdminPrivateRoute>}/>
          <Route path='/admin-product/edit/:productId' element={<AdminPrivateRoute><EditProduct/></AdminPrivateRoute>}/>
          <Route path='/admin-product/:productId' element={<AdminPrivateRoute><Product/></AdminPrivateRoute>}/>
          <Route path='/admin-categories' element={<AdminPrivateRoute><AllCategories/></AdminPrivateRoute>}/>
          <Route path='/admin-brands' element={<AdminPrivateRoute><AllBrands/></AdminPrivateRoute>}/>
          <Route path='/admin-orders' element={<AdminPrivateRoute><AllOrders/></AdminPrivateRoute>}/>
          <Route path='/admin-order/:orderId' element={<AdminPrivateRoute><Order/></AdminPrivateRoute>}/>
        </Routes>
      {admin&&window.location.pathname.includes('admin')?<AdminFooter/>:<Footer/>}

    </div>
  )
}


export default App