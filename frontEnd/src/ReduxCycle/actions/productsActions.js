import axios from "axios";
import { toast } from "react-toastify";
import {
  CLEAR_ERRORS,
  DELETE_PRODUCT,
  GET_ERRORS,
  GET_PRODUCT,
  GET_PRODUCTS,
} from "./actionsTypes";

export const addNewProduct =
  (productData, navigate, setLoading) => (dispatch) => {
    dispatch(clearErrors());
    setLoading(true);
    axios
      .post("products", productData)
      .then((res) => {
        toast.success("New product has been added", { theme: "colored" });
        navigate("/admin-products");
        setLoading(false);
      })

      .catch((err) => {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data,
        });
        setLoading(false);
      });
  };

export const editProduct =
  (productData, id, navigate, setLoading) => (dispatch) => {
    dispatch(clearErrors());
    setLoading(true);
    axios
      .put("products/" + id, productData)
      .then((res) => {
        toast.success("Product has been edited", { theme: "colored" });
        navigate("/admin-products");
        setLoading(false);
      })
      .catch((err) => {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data,
        });
        setLoading(false);
      });
  };

export const getProducts = (page) => (dispatch) => {
  axios
    .get(`products?page=${page}`)
    .then((res) => {
      dispatch({
        type: GET_PRODUCTS,
        payload: { data: res.data.products, count: res.data.count },
      });
    })

    .catch((err) => {
      dispatch({
        type: GET_PRODUCTS,
        payload: [],
      });
    });
};

export const getProductsForAdmins = () => (dispatch) => {
  axios
    .get(`products/admins`)
    .then((res) => {
      dispatch({
        type: GET_PRODUCTS,
        payload: { data: res.data.products, count: res.data.count },
      });
    })

    .catch((err) => {
      dispatch({
        type: GET_PRODUCTS,
        payload: [],
      });
    });
};

export const sortProducts = (sorted, num) => (dispatch) => {
  axios
    .get(`products/sort/${sorted}/${num}?page=0`)
    .then((res) => {
      dispatch({
        type: GET_PRODUCTS,
        payload: { data: res.data.products, count: res.data.count },
      });
    })

    .catch((err) => {
      dispatch({
        type: GET_PRODUCTS,
        payload: [],
      });
    });
};

export const getProductsByCategory = (category) => (dispatch) => {
  axios
    .get("products/category/" + category + "?page=0")
    .then((res) => {
      dispatch({
        type: GET_PRODUCTS,
        payload: { data: res.data.products, count: res.data.count },
      });
    })

    .catch((err) => {
      dispatch({
        type: GET_PRODUCTS,
        payload: [],
      });
    });
};

export const getProductsByFilter = (filterData) => (dispatch) => {
  axios
    .post("products/filter", filterData)
    .then((res) => {
      dispatch({
        type: GET_PRODUCTS,
        payload: { data: res.data.products, count: res.data.count },
      });
    })

    .catch((err) => {
      dispatch({
        type: GET_PRODUCTS,
        payload: [],
      });
    });
};

export const getProductsBySearch = (searchData) => (dispatch) => {
  axios
    .post("products/search?page=0", searchData)
    .then((res) => {
      dispatch({
        type: GET_PRODUCTS,
        payload: { data: res.data.products, count: res.data.count },
      });
    })

    .catch((err) => {
      dispatch({
        type: GET_PRODUCTS,
        payload: [],
      });
    });
};

export const getProductsByBrand = (brand) => (dispatch) => {
  axios
    .get("products/brand/" + brand + "?page=0")
    .then((res) => {
      dispatch({
        type: GET_PRODUCTS,
        payload: { data: res.data.products, count: res.data.count },
      });
    })

    .catch((err) => {
      dispatch({
        type: GET_PRODUCTS,
        payload: [],
      });
    });
};

export const getProduct = (product_id) => (dispatch) => {
  axios
    .get("products/" + product_id)
    .then((res) => {
      dispatch({
        type: GET_PRODUCT,
        payload: res.data,
      });
    })

    .catch((err) => {
      dispatch({
        type: GET_PRODUCT,
        payload: {},
      });
    });
};

export const deleteProduct = (product_id) => (dispatch) => {
  axios
    .delete("products/" + product_id)
    .then((res) => {
      toast.success("Product has been deleted", { theme: "colored" });
      dispatch({
        type: DELETE_PRODUCT,
        payload: product_id,
      });
    })

    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const addGallaryImages = (data, pro_id) => (dispatch) => {
  axios
    .post(`products/gallary/${pro_id}`, data)
    .then((res) => {
      dispatch({
        type: GET_PRODUCT,
        payload: res.data,
      });
    })

    .catch((err) => {
      dispatch({
        type: GET_PRODUCTS,
        payload: [],
      });
    });
};

export const deleteGallaryImage = (pro_id, img) => (dispatch) => {
  axios
    .delete(`products/gallary/${pro_id}/${img}`)
    .then((res) => {
      dispatch({
        type: GET_PRODUCT,
        payload: res.data,
      });
    })

    .catch((err) => {
      dispatch({
        type: GET_PRODUCTS,
        payload: [],
      });
    });
};

// clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS,
  };
};
