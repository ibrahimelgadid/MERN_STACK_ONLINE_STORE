import { faShoppingBag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";

const TopMenu = () => {
  let { isAuthenticated, user } = useSelector((state) => state.authReducer);

  return (
    <React.Fragment>
      <nav className="navbar navbar-expand-sm navbar-dark bg-dark p-0">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <FontAwesomeIcon icon={faShoppingBag} /> Online Store
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            {isAuthenticated ? (
              //
              // authentication links
              //
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <NavLink className="nav-link" to="/forum">
                    Forum
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/checkout">
                    Checkout
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/orders">
                    Orders
                  </NavLink>
                </li>
              </ul>
            ) : (
              //
              // guest links
              //
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <NavLink className="nav-link" to="/register">
                    Sign Up
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login">
                    Sign In
                  </NavLink>
                </li>
                <li></li>
              </ul>
            )}
            {
              //
              // admin links
              //
              (isAuthenticated && user.role === "superAdmin") ||
              (isAuthenticated && user.role === "admin") ? (
                <ul className="navbar-nav ms-auto">
                  <li className="nav-item">
                    <NavLink
                      className="nav-link"
                      to="/admin-area"
                      target={"_blank"}
                    >
                      Admin Area
                    </NavLink>
                  </li>
                </ul>
              ) : (
                ""
              )
            }
          </div>
        </div>
      </nav>
    </React.Fragment>
  );
};

export default TopMenu;
