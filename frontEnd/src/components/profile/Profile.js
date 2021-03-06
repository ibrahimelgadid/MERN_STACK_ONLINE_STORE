import {
  faEdit,
  faEnvelope,
  faGlobe,
  faInfoCircle,
  faSatellite,
  faUpload,
  faUser,
  faSkullCrossbones,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import {
  faYoutube,
  faFacebook,
  faTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { changeImg } from "../../ReduxCycle/actions/authActions";
import isEmpty from "../../utilis/isEmpty";

function Profile() {
  const [userAvatar, setUserAvatar] = useState("");
  const [errors, setErrors] = useState({});
  const [isMounted, setIsMounted] = useState(false);

  const { user } = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  const ChangeImg = bindActionCreators(changeImg, dispatch);
  const imgRef = useRef();
  const errorsFromState = useSelector((state) => state.errorsReducer);

  const blockUpload = userAvatar === "" ? "d-none" : "d-block";
  const blockEdit = userAvatar !== "" ? "d-none" : "d-block";

  const handleChangeImg = (e) => {
    e.preventDefault();
    const userAvatarData = new FormData();
    userAvatarData.append("userAvatar", userAvatar);
    userAvatarData.append("oldImg", user.avatar);
    ChangeImg(userAvatarData);
    setUserAvatar("");
  };

  useEffect(() => {
    if (isMounted) {
      setErrors(errorsFromState);
    } else {
      setIsMounted(true);
    }
    // eslint-disable-next-line
  }, [errors, errorsFromState]);

  return (
    <div className="row my-4 justify-content-center">
      <div className="col-sm-10 col-11">
        <div className="card">
          <div className="card-header text-info text-center">
            <h3>
              <FontAwesomeIcon icon={faInfoCircle} />
              User info
            </h3>
          </div>

          <div className="card-body">
            <div className="row">
              <div className="col-sm-4 text-center">
                <img
                  ref={imgRef}
                  style={{ width: "150px", height: "150px" }}
                  alt=""
                  className="d-block img-fluid rounded-circle img-thumbnail mx-auto"
                  src={user.avatar}
                />

                <form onSubmit={handleChangeImg}>
                  <label style={{ cursor: "pointer" }} htmlFor="userAvatar">
                    <FontAwesomeIcon
                      icon={faEdit}
                      className={"text-dark " + blockEdit}
                    />
                  </label>
                  <input
                    className="d-none"
                    id="userAvatar"
                    type={"file"}
                    onChange={(e) => {
                      setUserAvatar(e.target.files[0]);
                      var file = e.target.files[0];
                      var reader = new FileReader();
                      reader.onload = function (e) {
                        // The file's text will be printed here
                        var content = e.target.result;
                        imgRef.current.src = content;
                      };
                      reader.readAsDataURL(file);
                    }}
                  />

                  <input
                    type={"submit"}
                    id="upload"
                    className="d-none"
                    value={"uplaod"}
                    accept="image/*"
                  />
                  <label
                    className={"text-success " + blockUpload}
                    htmlFor="upload"
                    style={{ cursor: "pointer" }}
                  >
                    <button className="btn btn-dark btn-sm">
                      <FontAwesomeIcon icon={faUpload} />
                    </button>
                  </label>
                </form>

                {errors.userAvatar ? (
                  <p className="text-danger">
                    <FontAwesomeIcon icon={faSkullCrossbones} />{" "}
                    {errors.userAvatar}
                  </p>
                ) : null}

                <strong className="d-block text-info">{user.name}</strong>
              </div>

              <div className="col-sm-8">
                <ul className="list-group ">
                  <li className="list-group-item">
                    <strong>
                      <FontAwesomeIcon icon={faUser} /> Name :-{" "}
                    </strong>
                    {user.name}
                  </li>
                  <li className="list-group-item">
                    <strong>
                      <FontAwesomeIcon icon={faEnvelope} /> Email :-{" "}
                    </strong>
                    {user.email}
                  </li>
                  <li className="list-group-item">
                    <strong>
                      <FontAwesomeIcon icon={faGlobe} /> Role :-{" "}
                    </strong>
                    {user.role}
                  </li>
                  <li className="list-group-item">
                    <strong>
                      <FontAwesomeIcon icon={faSatellite} /> Social :-{" "}
                    </strong>
                    {!isEmpty(user.social.youtube) ? (
                      <a
                        target={"_blank"}
                        rel="noreferrer"
                        href="http://www.youtube.com"
                      >
                        <FontAwesomeIcon
                          className="mr-1"
                          style={{ color: "#ff0000" }}
                          icon={faYoutube}
                        />
                      </a>
                    ) : (
                      ""
                    )}
                    {!isEmpty(user.social.facebook) ? (
                      <a
                        target={"_blank"}
                        rel="noreferrer"
                        href="http://www.facebook.com"
                      >
                        <FontAwesomeIcon
                          className="mr-1"
                          style={{ color: "#1877f2" }}
                          icon={faFacebook}
                        />
                      </a>
                    ) : (
                      ""
                    )}
                    {!isEmpty(user.social.instagram) ? (
                      <a
                        target={"_blank"}
                        rel="noreferrer"
                        href="http://www.instagram.com"
                      >
                        <FontAwesomeIcon
                          className="mr-1"
                          style={{ color: "#405de6" }}
                          icon={faInstagram}
                        />
                      </a>
                    ) : (
                      ""
                    )}
                    {!isEmpty(user.social.twitter) ? (
                      <a
                        target={"_blank"}
                        rel="noreferrer"
                        href="http://www.twitter.com"
                      >
                        <FontAwesomeIcon
                          className="mr-1"
                          style={{ color: "#1da1f2" }}
                          icon={faTwitter}
                        />
                      </a>
                    ) : (
                      ""
                    )}
                  </li>
                </ul>
              </div>
              <hr className=" justify-content-center my-4" />
              <div className="btn-toolbar" role="group">
                <button className="d-inline mr-1 btn btn-secondary">
                  <Link
                    style={{ textDecoration: "none" }}
                    className="text-light"
                    to={"/"}
                  >
                    Back
                  </Link>
                </button>

                <button className="d-inline mr-1 btn btn-secondary">
                  <Link
                    style={{ textDecoration: "none" }}
                    className="text-light"
                    to={"/edit-profile"}
                  >
                    Edit Profile
                  </Link>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
