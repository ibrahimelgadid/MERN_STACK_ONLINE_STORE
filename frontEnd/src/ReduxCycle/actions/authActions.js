import axios from "axios";
import { toast } from "react-toastify";
import {
  CLEAR_ERRORS,
  GET_ERRORS,
  GET_USER_EDIT,
  SET_CURRENT_USER,
} from "./actionsTypes";
import jwtDecode from "jwt-decode";
import setTokenInHeaders from "../../utilis/setTokenInHeaders";
import io from 'socket.io-client'
import { addNewNotification } from '../../ReduxCycle/actions/notificationsActions';



//---------------------------------------------|
//           POST REGISTER USER                |
//---------------------------------------------|
export const register = (registerData, navigate) => (dispatch) => {
  dispatch(clearErrors());
  axios
    .post("http://localhost:5000/users/register", registerData)
    .then((res) => {

      toast.success("You have been registered, login now", {
        theme: "colored",
      });
      var socket = io('http://localhost:5000')

      //real-time notification
      socket.emit('notify',{
        data:res.data,
        from:res.data._id,
        type:'userRegister'
      })

      //Add notification to database
      // const AddNewNotification = bindActionCreators(addNewNotification, useDispatch());
      dispatch(addNewNotification({
        data:res.data,
        from:res.data._id,
        type:'userRegister'
      }))
      navigate("/login");
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const login = (loginData) => (dispatch) => {
  dispatch(clearErrors());
  axios
    .post("http://localhost:5000/users/login", loginData)
    .then((res) => {
      let { token } = res.data;
      let decodedData = jwtDecode(token);
      localStorage.setItem("token", token);
      setTokenInHeaders(token);

      dispatch({
        type: SET_CURRENT_USER,
        payload: decodedData,
      });
      toast.success("You have been logged in", { theme: "colored" });
    })

    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const logOut = () => (dispatch) => {
  localStorage.removeItem("token");
  setTokenInHeaders(false);
  dispatch({
    type: SET_CURRENT_USER,
    payload: {},
  });
};

export const editProfile = (editProfileData, navigate) => (dispatch) => {
  dispatch(clearErrors());
  axios
    .put("http://localhost:5000/users/edit", editProfileData)
    .then((res) => {
      localStorage.removeItem("token");
      setTokenInHeaders(false);
      dispatch({
        type: SET_CURRENT_USER,
        payload: {},
      });
      toast.success("Your profile Data have been edited, loggin again", {
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

export const changeImg = (imgData) => (dispatch) => {
  dispatch(clearErrors());
  axios
    .put("http://localhost:5000/users/changeImg", imgData)
    .then((res) => {
      localStorage.removeItem("token");
      setTokenInHeaders(false);
      dispatch({
        type: SET_CURRENT_USER,
        payload: {},
      });
      toast.success("Your profile Image have been edited, loggin again", {
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

export const getProfile = () => (dispatch) => {
  axios
    .get("http://localhost:5000/users")
    .then((res) => {
      dispatch({
        type: GET_USER_EDIT,
        payload: res.data,
      });
    })

    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const sendMailToResetPass =
  (data, navigate, setLoading) => (dispatch) => {
    setLoading(true);
    axios
      .post("http://localhost:5000/users/reset-password-by-mail", data)
      .then((res) => {
        setLoading(false);
        navigate("/verify");
      })
      .catch((err) => {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data,
        });
      });
  };


  export const resetPass =
  (data, navigate, token, email) => (dispatch) => {
    axios
      .post(`http://localhost:5000/users/resetPass/${token}/${email}`, data)
      .then((res) => {
        navigate("/login");
        toast.success('Your password has been changed, plesse login now',{theme:'colored'})
      })
      .catch((err) => {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data,
        });
      });
  };
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS,
  };
};
