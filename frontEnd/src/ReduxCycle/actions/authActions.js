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
export const register = (registerData, navigate, setLoading) => (dispatch) => {
  dispatch(clearErrors());
  setLoading(true);
  axios
    .post("users/register", registerData)
    .then((res) => {
      toast.success("You have been registered, login now");
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

export const login = (loginData, setLoading) => (dispatch) => {
  dispatch(clearErrors());
  setLoading(true);
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

export const logOut = () => (dispatch) => {
  localStorage.removeItem("token");
  setTokenInHeaders(false);
  dispatch({
    type: SET_CURRENT_USER,
    payload: {},
  });
};

export const editProfile =
  (editProfileData, navigate, setLoading) => (dispatch) => {
    dispatch(clearErrors());
    setLoading(true);
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

export const changeImg = (imgData) => (dispatch) => {
  dispatch(clearErrors());
  axios
    .put("users/changeImg", imgData)
    .then((res) => {
      localStorage.setItem("token", res.data.token);
      dispatch({
        type: SET_CURRENT_USER,
        payload: jwtDecode(localStorage.token),
      });
      toast.success("Your profile Image have been changed");
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
    dispatch(clearErrors());
    axios
      .post("users/reset-password-by-mail", data)
      .then((res) => {
        setLoading(false);
        navigate("/verify");
      })
      .catch((err) => {
        setLoading(false);
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data,
        });
      });
  };

export const resetPass =
  (data, navigate, token, email, setLoading) => (dispatch) => {
    setLoading(true);
    dispatch(clearErrors());
    axios
      .post(`users/resetPass/${token}/${email}`, data)
      .then((res) => {
        navigate("/login");
        toast.success("Your password has been changed, plesse login now", {
          theme: "colored",
        });
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
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS,
  };
};
