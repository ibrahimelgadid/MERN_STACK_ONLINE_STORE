import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from 'redux';
import isEmpty from '../../utilis/isEmpty';
import { Spinner } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";
import { deleteOrder, getOrders } from '../../ReduxCycle/actions/ordersAction';
import classnames from 'classnames'

function AllOrders() {

 const {orders} = useSelector(state=>state.ordersReducer)
  const GetOrders = bindActionCreators(getOrders, useDispatch())
  const DeleteOrder = bindActionCreators( deleteOrder, useDispatch())
 const navigate = useNavigate()



  const handleDelete = (order_id)=>{
    DeleteOrder(order_id)
  }

  useEffect(()=>{
    GetOrders()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const ordersData = !isEmpty(orders)?(
    <table className="table table-striped table-bordered my-4 text-center">
          <thead>
            <tr>
              <th>ID</th>
              <th>Consumer</th>
              <th>Price</th>
              <th>Count</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order,i)=>(
        
            <tr key={order._id}>
              <td >{i+1}</td>
              <td>{order.orderOwner.name}</td>

              <td>${order.cart.totalPrice}</td>
              <td>{order.cart.selectedProduct.length} items</td>
              <td className={classnames(
                {'text-warning':order.status==='0'},
                {'text-primary':order.status==='1'},
                {'text-danger':order.status==='2'},
                {'text-success':order.status==='3'},
                )}>{order.status==='0'?<strong><i className='fas fa-exclamation-circle text-warning'> Pendeng</i></strong>:
                order.status==='3'?<strong><i className='fas fa-check-circle text-success'> Completed</i></strong>:
                order.status==='1'?<strong><i className='fas fa-history text-primary'> Processing</i></strong>:
                <strong><i className='fas fa-times-circle text-danger'> Cancelled</i></strong>
                }</td>
              <td>
                <i style={{cursor:'pointer'}} 
                onClick={()=>handleDelete(order._id)} 
                className='far fa-times-circle text-danger'></i>

                <Link to={`/admin-order/${order._id}`}>
                  <i style={{cursor:'pointer'}} 
                  className="fas fa-info-circle text-primary ml-2"></i> 
                </Link>
              </td>

            </tr>
            ))}
          </tbody>
        </table>
  ):<Spinner animation="border" role="status" />;
  return (
    <div className='brands container mt-4'>
      <h3 className='text-center text-info'>Orders Show</h3>
        <div onClick={()=>navigate(-1)} className="btn btn-sm btn-outline-dark my-4 float-left">
          <i className="fas fa-arrow-circle-left"></i> back
        </div>

        {ordersData}
    </div>
  )
}

export default AllOrders