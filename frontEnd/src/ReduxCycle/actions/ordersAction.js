import axios from "axios";
import { toast } from "react-toastify";
import { CLEAR_ERRORS, DELETE_ORDER, GET_ERRORS, GET_ORDER, GET_ORDERS } from "./actionsTypes";



export const getOrders = () => (dispatch) => {
  axios
    .get("http://localhost:5000/orders")
    .then((res) => {
      dispatch({
        type:GET_ORDERS,
        payload:res.data
      })
    })
    .catch((err) => {
      dispatch({
        type: GET_ORDERS,
        payload:[],
      });
    });
};


export const getOrder = (order_id) => (dispatch) => {
  axios
    .get(`http://localhost:5000/orders/${order_id}`)
    .then((res) => {
      dispatch({
        type:GET_ORDER,
        payload:res.data
      })
    })
    .catch((err) => {
      dispatch({
        type: GET_ORDER,
        payload:{},
      });
    });
};


export const addNewOrder = (orderData, navigate) => (dispatch) => {
  dispatch(clearErrors());
  axios.post("http://localhost:5000/orders", orderData)
    .then((res) => {
      navigate('/cart');
      toast.success('New order has been added')
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload:err.response.data,
      });
    });
};


export const editOrder = (orderData) => (dispatch) => {
  dispatch(clearErrors());
  axios.put("http://localhost:5000/orders", orderData)
    .then((res) => {
      dispatch({
        type:GET_ORDER,
        payload:res.data
      })
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload:{},
      });
    });
};


export const deleteOrder = (order_id) => (dispatch) => {
  axios.post("http://localhost:5000/orders/delete",{order_id})
    .then((res) => {
      toast.success('Order has been deleted')
      dispatch({
        type: DELETE_ORDER,
        payload:order_id
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload:err.response.data,
      });
    });
};


export const clearErrors = ()=>{
  return{
    type:CLEAR_ERRORS
  }
}