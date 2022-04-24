import axios from "axios";
import { toast } from "react-toastify";
import { CLEAR_ERRORS, GET_ERRORS, SET_CURRENT_USER } from "./actionsTypes";
import jwtDecode from "jwt-decode";
import setTokenInHeaders from "../../utilis/setTokenInHeaders";
import io from "socket.io-client";
import { addNewNotification } from "../../ReduxCycle/actions/notificationsActions";
import { socketConn } from "../../utilis/socket";

//---------------------------------------------|
//           POST REGISTER USER                |
//---------------------------------------------|
export const register = (registerData, navigate) => (dispatch) => {
  dispatch(clearErrors());
  axios
    .post("users/register", registerData)
    .then((res) => {
      toast.success("You have been registered, login now", {
        theme: "colored",
      });
      var socket = io(socketConn);

      //real-time notification
      socket.emit("notify", {
        data: res.data,
        from: res.data._id,
        type: "userRegister",
      });

      //Add notification to database
      // const AddNewNotification = bindActionCreators(addNewNotification, useDispatch());
      dispatch(
        addNewNotification({
          data: res.data,
          from: res.data._id,
          type: "userRegister",
        })
      );
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
    .post("users/login", loginData)
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
    .put("users/edit", editProfileData)
    .then((res) => {
      localStorage.setItem("token", res.data.token);
      navigate(-1);
      dispatch({
        type: SET_CURRENT_USER,
        payload: jwtDecode(localStorage.token),
      });
      toast.success("Your profile Data have been edited", {
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
    .put("users/changeImg", imgData)
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

export const sendMailToResetPass =
  (data, navigate, setLoading) => (dispatch) => {
    setLoading(true);
    axios
      .post("users/reset-password-by-mail", data)
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

export const resetPass = (data, navigate, token, email) => (dispatch) => {
  axios
    .post(`users/resetPass/${token}/${email}`, data)
    .then((res) => {
      navigate("/login");
      toast.success("Your password has been changed, plesse login now", {
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
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS,
  };
};
