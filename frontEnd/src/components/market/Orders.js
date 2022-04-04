import React, { useEffect } from 'react';
import{ useDispatch, useSelector} from 'react-redux';
import { bindActionCreators } from 'redux';
import { getOrders } from '../../ReduxCycle/actions/ordersAction';
import isEmpty from '../../utilis/isEmpty';
import Moment from "react-moment";


function Orders() {

  let {orders, loading} = useSelector(state=>state.ordersReducer)
  let GetOrders = bindActionCreators(getOrders,useDispatch())
  useEffect(()=>{
    GetOrders()
    // eslint-disable-next-line
  }, [])
  return (
    <div className='orders container my-4'>
      <div className="row justify-content-center">
        {isEmpty(orders) && loading?(
          <div className="spinner-border my-4" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        ):(
          orders.length>0?(
            orders.map(order=>(
              <div key={order._id} className="col-11 col-sm-6 col-md-3">
                <div className="card">
                  <div className="card-header">
                    <i className='fas fa-align-justify'></i>
                    <span className='border bg-secondary ml-2'>Date</span>
                    <span className='border bg-white'>
                      <Moment format="YYYY-MM-DD HH:mm">
                        {order.createdAt}
                      </Moment>
                      </span>
                  </div>
                  <div className="card-body">
                    {order.cart.selectedProduct.map(pro=>(
                      <div key={pro._id} className='d-flex'>
                        <small className='fw-bold float-left'>{pro.name}</small>
                      </div>
                    ))}
                    <strong>Price: </strong>${order.cart.totalPrice}
                  </div>
                  <div className="card-footer">
                    {order.status === '0'?
                    (<i className='fas fa-exclamation-circle text-warning'> Pendeng</i>):
                    order.status === '3'?
                    (<i className='fas fa-check-circle text-success'> Completed</i>):
                    order.status === '1'?
                    (<i className='fas fa-history text-primary'> Processing</i>):
                    (<i className='fas fa-times-circle text-danger'> Cancelled</i>)
                    }
                    
                  </div>
                </div>
              </div>
            ))
          ):(
            <strong className='text-danger'> <i className='fas fa-exclamation-circle'></i> There is no orders</strong>
          )
        )}

              {/* <i className='fas fa-exclamation-circle'></i>  */}

              {/* <i className='fas fa-times-circle'></i> Cancelled */}

              {/* <i className='fas fa-history'></i> Processing */}


      </div>
    </div>
    )
}

export default Orders;
