import { faShoppingBag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";

const TopMenu = () => {
  let {isAuthenticated, user} = useSelector(state => state.authReducer)

  return (
    <React.Fragment>
      <nav className="navbar navbar-expand-sm navbar-dark bg-dark p-0">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <FontAwesomeIcon icon={faShoppingBag}/>  Online Store
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
            <ul className="navbar-nav">
              <li className="nav-item dropdown">
                <button
                  className="btn nav-link dropdown-toggle font-weight-bold"
                  id="navbarDropdown"
                  data-toggle="dropdown"
                  aria-expanded="false"
                >
                  All Pages
                </button>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  {
                    isAuthenticated?
                    (
                      <>

                    <li>
                      <NavLink className="dropdown-item" to="/checkout">
                        Checkout Page
                      </NavLink>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>

                      </>
                    ):(
                      <>
                      <li>
                        <NavLink className="dropdown-item" to="/register">
                          Sign Up
                        </NavLink>
                      </li>
                      <li>
                        <NavLink className="dropdown-item" to="/login">
                          Sign In
                        </NavLink>
                      </li>
                      <li>
                      <hr className="dropdown-divider" />
                      </li>
                      </>
                    )

                  }
                  {
                    (isAuthenticated && user.role === 'superAdmin') ||
                    (isAuthenticated && user.role === 'admin')
                    ?(
                      <li>
                      <a className="dropdown-item" href="/admin-area" target={'_blank'}>
                        Admin Area
                      </a>
                      </li>
                    ):''
                  }
                </ul>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/orders">
                  Orders
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/forum">
                  Forum
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </React.Fragment>
  );
};

export default TopMenu;
