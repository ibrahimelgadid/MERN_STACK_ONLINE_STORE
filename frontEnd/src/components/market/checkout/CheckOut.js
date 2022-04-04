import React, { useEffect, useState } from "react";
import Cart from "./Cart";
import Contact from "./Contact";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { Navigate } from "react-router-dom";
import { getCartElements } from "../../../ReduxCycle/actions/cartActions";
import isEmpty from "../../../utilis/isEmpty";




function CheckOut() {

  let [phone, setPhone] = useState('')


  
  let {cart,loading, selectedProduct} = useSelector(state=>state.cartReducer);
  let GetCartElements = bindActionCreators(getCartElements,useDispatch());


  useEffect(()=>{
    GetCartElements()
    // eslint-disable-next-line
  }, [])




  return (
    isEmpty(cart)&&loading?(
      <div className="spinner-border my-4" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      ):
    (

      isEmpty(cart)&&!loading?(
        <Navigate to={'/cart'}/>
      ):(
        cart.selectedProduct.length>0?(
          <div className="checkout border border-1 rounded-2  border-light m-4">
              <div className="row">

                <div className="col-md-8">
                  <Contact 
                    phone={phone}
                    setPhone={setPhone}
                  />
                </div>
                <div className="col-md-4">
                  <Cart loading={loading} cart={cart} selectedProduct={selectedProduct}  phone={phone}/>
                </div>
            </div>
          {/* </form> */}
  
          </div>
        ):(<Navigate to={'/cart'}/>)
      )
    )
  );
}

export default CheckOut;
