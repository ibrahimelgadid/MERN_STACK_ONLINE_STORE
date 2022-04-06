import axios from "axios";
import { toast } from "react-toastify";
import { CLEAR_ERRORS, GET_CART, GET_ERRORS, PRODUCT_DEC, PRODUCT_DELETE, PRODUCT_INC } from "./actionsTypes";

export const addProductToCart = (productData) => (dispatch) => {
  dispatch(clearErrors());
  axios
    .post("cart/addtocart", productData)
    .then((res) => {
      dispatch({
        type:GET_CART,
        payload: res.data,
      })
      toast.success(`This product added to cart`, {
        theme: "colored",
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};


export const cartProductInc = (productData) => (dispatch) => {
  axios
    .post("cart/iqty", productData)
    .then((res) => {
      dispatch({
        type:PRODUCT_INC,
        payload:{data:res.data, index:productData.index}
      })
      // toast.success(`This product quantity increased`, {
      //   theme: "colored",
      // });
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};


export const cartProductValue = (productData) => (dispatch) => {
  axios
    .post("cart/vqty", productData)
    .then((res) => {
      dispatch({
        type:PRODUCT_INC,
        payload:{data:res.data, index:productData.index}
      })
      // toast.success(`This product quantity increased`, {
      //   theme: "colored",
      // });
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};


export const cartProductDec = (productData) => (dispatch) => {
  axios
    .post("cart/dqty", productData)
    .then((res) => {
      dispatch({
        type:PRODUCT_DEC,
        payload:{data:res.data, index:productData.index}
      })
      // toast.success(`This product quantity decreased`, {
      //   theme: "colored",
      // });
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};


export const getCartElements = () => (dispatch) => {
  axios
    .get("cart")
    .then((res) => {
      dispatch({
        type:GET_CART,
        payload:res.data
      })
    })
    .catch((err) => {
      dispatch({
        type: GET_CART,
        payload:[],
      });
    });
};




export const deleteProductFromCart = (data) => (dispatch) => {
  dispatch(clearErrors());
  axios
    .post("cart/pro", data)
    .then((res) => {
      dispatch({
        type:PRODUCT_DELETE,
        payload:{data:res.data, index:data.index}
      })
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload:err.response.data,
      });
    });
};  




export const clearCart = () => (dispatch) => {
  dispatch(clearErrors());
  axios
    .post("cart/clear")
    .then((res) => {
      dispatch({
        type:GET_CART,
        payload:[]
      })
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload:err.response.data,
      });
    });
};  

export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS,
  };
};
