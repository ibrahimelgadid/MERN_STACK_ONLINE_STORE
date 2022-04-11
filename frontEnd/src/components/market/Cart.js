import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from 'redux';
import { cartProductDec, cartProductInc, clearCart, deleteProductFromCart, getCartElements } from '../../ReduxCycle/actions/cartActions';
import isEmpty from "../../utilis/isEmpty";

function Cart() {

  const navigate = useNavigate()
  const {cart,selectedProduct, loading} = useSelector(state=>state.cartReducer)

  const dispatch = useDispatch()
  const GetCartElements = bindActionCreators(getCartElements, dispatch);
  const CartProductInc = bindActionCreators(cartProductInc, dispatch);
  const CartProductDec = bindActionCreators(cartProductDec, dispatch);
  const DeleteProductFromCart = bindActionCreators(deleteProductFromCart, dispatch);
  const ClearCart = bindActionCreators(clearCart, dispatch);

  

  const handleDelete=(index)=>{
    const data = {index}
    DeleteProductFromCart(data)
  }


  const handleClearCart=()=>{
    ClearCart()
  }

  const handlePlus = (index,price)=>{
    const productData={
      index,price
    }
    CartProductInc(productData)
  }

  const handleMinus = (index,price)=>{
    const productData={
      index,price
    }
    CartProductDec(productData)
  }

  useEffect(()=>{
    GetCartElements()
    // eslint-disable-next-line
  }, [])

  
  return (
    <div className='cart mx-2'>
      <div className="card my-4">
        <div className="card-header">
          <h3 className='text-info text-center'>Cart Details</h3>
        </div>
        <div className="card-body">
          {isEmpty(cart)&&loading?(
            <div className="spinner-border my-4" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
        ):(
          !isEmpty(cart)&&selectedProduct.length>0?(
          <table className="table text-start">
            <thead>
              <tr>
                <th>Name</th>
                {/* <th>Pic</th> */}
                <th>Price</th>
                <th>QTY</th>
                <th>Total Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {selectedProduct.map((pro, index)=>(

                  <tr key={pro._id}>
                  <td>{pro.name}</td>
                  {/* <td><img className='img-thumbnail rounded-circle' style={{height:'40px', width:'40px'}} src="../../../images/noimage.png" alt="" /></td> */}
                  <td >{pro.price/pro.qty}</td>
                  <td>
                    <strong className="float-start text-success">{pro.qty}</strong>
                    <small className="btn-group d-inline float-end" role="group" aria-label="">
                      <button onClick={()=>handlePlus(index, pro.price/pro.qty)} className="btn btn-sm btn-outline-success">+</button>
                      {/* <form onSubmit={(e)=>handleValue(e, index, pro.price/pro.qty)} className='d-inline border border-0'>

                        <input
                          className='btn-group' 
                          style={{maxWidth:"30px",height: '31px'}} 
                          type="text"
                          value={val}
                          onChange={(e)=>setVal(e.target.value)}
                          />
                      </form> */}

                      <button disabled={pro.qty>1?false:true} onClick={()=>handleMinus(index, pro.price/pro.qty)} className={pro.qty ===1?"btn btn-sm btn-success disabled":"btn btn-sm btn-success"}>-</button>
                    </small>
                  </td>
                  <td>${pro.price}</td>

                  <td className='text-end'>
                    <button onClick={()=>handleDelete(index)} className='btn btn-sm btn-outline-danger'>
                      <i className='fas fa-trash'></i>
                    </button>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
              ):(
                <strong className='text-danger'> <i className='fas fa-exclamation-circle'></i> There is no items</strong>
              )
            )}
              
            <h6 className='float-end mt-2'> Total Price : <strong>${!isEmpty(cart)?cart.totalPrice:0}</strong></h6>
        </div>
        <div className="card-footer">
          <div className="btn-group float-start" role="group" aria-label="Basic example">
            <button onClick={()=>navigate(-1)} type="button" className="btn btn-secondary"><i className='fas fa-arrow-circle-left'></i></button>
            <Link to={'/checkout'} className="btn btn-outline-primary"><i className='fas fa-money-bill'> ${!isEmpty(cart)?cart.totalPrice:0}</i></Link>
          </div>
          <div className="float-end">
          <button onClick={()=>{if(window.confirm('Do you want to clear cart, this action cannot be undo?')){handleClearCart()}}}  className="btn btn-sm btn-outline-danger" ><i className='fas fa-trash'> clear cart </i></button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart;
