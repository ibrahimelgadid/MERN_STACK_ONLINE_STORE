import axios from "axios";
import { toast } from "react-toastify";
import {
  ADD_CATEGORY,
  CLEAR_ERRORS,
  DELETE_CATEGORY,
  EDIT_CATEGORY,
  GET_CATEGORIES,
  GET_CATEGORY,
  GET_ERRORS,
} from "./actionsTypes";

export const addNewCategory = (categoryData, setLoading) => (dispatch) => {
  dispatch(clearErrors());
  setLoading(true);
  axios
    .post("categories", categoryData)
    .then((res) => {
      dispatch({
        type: ADD_CATEGORY,
        payload: res.data,
      });
      setLoading(false);
      toast.success("New category has been added");
    })

    .catch((err) => {
      setLoading(false);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const editCategory = (categoryData, id, setLoading) => (dispatch) => {
  dispatch(clearErrors());
  setLoading(true);
  axios
    .put("categories/" + id, categoryData)
    .then((res) => {
      dispatch({
        type: EDIT_CATEGORY,
        payload: { id: id, data: res.data },
      });
      setLoading(false);
      toast.success("Category has been edited");
    })
    .catch((err) => {
      setLoading(false);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const getCategories = () => (dispatch) => {
  axios
    .get("categories")
    .then((res) => {
      dispatch({
        type: GET_CATEGORIES,
        payload: res.data,
      });
    })

    .catch((err) => {
      dispatch({
        type: GET_CATEGORIES,
        payload: [],
      });
    });
};

export const getCategory = (category_id) => (dispatch) => {
  axios
    .get("categories/" + category_id)
    .then((res) => {
      dispatch({
        type: GET_CATEGORY,
        payload: res.data,
      });
    })

    .catch((err) => {
      dispatch({
        type: GET_CATEGORY,
        payload: {},
      });
    });
};

export const deleteCategory = (category_id) => (dispatch) => {
  axios
    .delete("categories/" + category_id)
    .then((res) => {
      toast.success("Category has been deleted");
      dispatch({
        type: DELETE_CATEGORY,
        payload: category_id,
      });
    })

    .catch((err) => {
      dispatch({
        type: DELETE_CATEGORY,
        payload: err.response.data,
      });
    });
};

export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS,
  };
};
