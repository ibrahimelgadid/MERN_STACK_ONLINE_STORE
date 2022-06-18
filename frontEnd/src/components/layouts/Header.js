import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ReactComponent as IconCart3 } from "bootstrap-icons/icons/cart3.svg";
import { ReactComponent as IconPersonBadgeFill } from "bootstrap-icons/icons/person-badge-fill.svg";
import { ReactComponent as IconListCheck } from "bootstrap-icons/icons/list-check.svg";
import { ReactComponent as IconDoorClosedFill } from "bootstrap-icons/icons/door-closed-fill.svg";
import { ReactComponent as IconBellFill } from "bootstrap-icons/icons/bell-fill.svg";

import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { logOut } from "../../ReduxCycle/actions/authActions";
import { getCartElements } from "../../ReduxCycle/actions/cartActions";
import isEmpty from "../../utilis/isEmpty";

const Header = () => {
  const { cart } = useSelector((state) => state.cartReducer);
  const { isAuthenticated, user } = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  const LogOut = bindActionCreators(logOut, dispatch);
  const GetCartElements = bindActionCreators(getCartElements, dispatch);

  useEffect(() => {
    if (isAuthenticated) {
      GetCartElements();
    }
    // eslint-disable-next-line
  }, []);

  return (
    <header className="p-3 border-bottom bg-light">
      <div className="container-fluid">
        <div className="row g-3">
          {isAuthenticated && (
            <div className="col-md-12">
              <div className="position-relative d-inline mr-3">
                <Link to="/cart" className="btn btn-primary">
                  <IconCart3 className="i-va" />
                  <div className="position-absolute top-0 left-100 translate-middle badge bg-danger rounded-circle">
                    {isEmpty(cart) ? 0 : cart.totalQty}
                  </div>
                </Link>
              </div>
              <div className="btn-group">
                <button
                  type="button"
                  className="btn btn-sm rounded-circle border mr-3 dropdown-toggle1"
                  data-toggle="dropdown"
                  aria-expanded="false"
                  aria-label="Profile"
                >
                  <img
                    alt=""
                    style={{
                      borderRadius: "50px",
                      width: "50px",
                      height: "50px",
                    }}
                    src={user.avatar}
                  />
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      <IconPersonBadgeFill /> My Profile
                    </Link>
                  </li>

                  <li>
                    <Link className="dropdown-item" to="/orders">
                      <IconListCheck className="text-primary" /> Orders
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/account/notification">
                      <IconBellFill className="text-primary" /> Notification
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li onClick={LogOut}>
                    <Link className="dropdown-item" to="/">
                      <IconDoorClosedFill className="text-danger" /> Logout
                    </Link>
                  </li>
                </ul>
              </div>
              <a
                href="https://www.buymeacoffee.com/ibrahimelgadid"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
                  alt="BuyMeACoffee"
                  width="120"
                />
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
export default Header;
