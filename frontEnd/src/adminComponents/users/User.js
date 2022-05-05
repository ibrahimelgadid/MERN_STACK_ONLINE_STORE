import {
  faFacebook,
  faInstagram,
  faTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { bindActionCreators } from "redux";
import { getUser } from "../../ReduxCycle/actions/membersActions";
import isEmpty from "../../utilis/isEmpty";
import Moment from "react-moment";
import { imgServer } from "../../utilis/imageServer";

function User() {
  const { user, loading } = useSelector((state) => state.membersReducer);
  const dispatch = useDispatch();
  const GetUser = bindActionCreators(getUser, dispatch);
  const { user_id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    GetUser(user_id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      <div className="row justify-content-center my-4">
        <div className="col-11 col-md-10">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-dark d-block mb-2"
          >
            back
          </button>
          {isEmpty(user) && loading ? (
            <div className="text-center">
              <Spinner animation="border" role="status" />
            </div>
          ) : !isEmpty(user) ? (
            <div className="card shadow">
              <div className="card-header text-center">
                <h3>{user.name}</h3>
              </div>
              <div className="card-body">
                <div className="col-sm-4 text-center my-4">
                  <img
                    style={{ width: "150px", height: "150px" }}
                    alt=""
                    className="img-fluid rounded-circle img-thumbnail mx-auto"
                    src={
                      user.avatar === "noimage.png"
                        ? `../../../images/${user.avatar}`
                        : `${imgServer}/userAvatar/${user.avatar}`
                    }
                  />
                </div>
                <p>
                  <strong>
                    <i className="fas fa-user"></i> Name:-{" "}
                  </strong>{" "}
                  <small className="text-muted">{user.name}</small>
                </p>
                <p>
                  <strong>
                    <i className="fas fa-envelope"></i> Email:-{" "}
                  </strong>{" "}
                  <small className="text-muted">{user.email}</small>
                </p>
                <p>
                  <strong>
                    <i className="fas fa-user-tag"></i> Role:-{" "}
                  </strong>{" "}
                  {user._id === "superAdmin" ? (
                    <Link
                      to={`/admin-users/role/${user._id}`}
                      className="badge badge-danger"
                    >
                      {user.role}
                    </Link>
                  ) : (
                    user.role
                  )}
                </p>
                <p>
                  <strong>
                    <i className="fas fa-stopwatch"></i> Register At:-{" "}
                  </strong>{" "}
                  <small className="text-muted">
                    <Moment format="YYYY/MM/DD - HH:mm">
                      {user.createdAt}
                    </Moment>
                  </small>
                </p>
                <p>
                  <strong>
                    <i className="fas fa-address-card"></i> Address:-{" "}
                  </strong>{" "}
                  <small className="text-muted">
                    {user.address ? user.address : "This member has no address"}
                  </small>
                </p>
                {user.social ? (
                  <p>
                    <strong>
                      <i className="fas fa-satellite-dish"></i> Socials:-{" "}
                    </strong>
                    <small className="text-muted">
                      {user.social.youtube ? (
                        <a
                          rel="noreferrer"
                          target={"_blank"}
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
                      {user.social.facebook ? (
                        <a
                          rel="noreferrer"
                          target={"_blank"}
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
                      {user.social.instagram ? (
                        <a
                          rel="noreferrer"
                          target={"_blank"}
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
                      {user.social.twitter ? (
                        <a
                          rel="noreferrer"
                          target={"_blank"}
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
                    </small>
                  </p>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="text-center">
              <strong className="text-danger">
                {" "}
                <i className="fas fa-exclamation-circle"></i> There is no user
                for this id
              </strong>{" "}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default User;
