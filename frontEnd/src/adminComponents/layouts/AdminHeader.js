import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import io from "socket.io-client";
import {
  clearNotification,
  deleteNotification,
  getNotifications,
} from "../../ReduxCycle/actions/notificationsActions";
import { format } from "timeago.js";
import {socketConn} from '../../utilis/socket';

var socket = io(socketConn);

function AdminHeader() {
  let navbaradgeq = {
    fontSize: ".6rem",
    fontWeight: "300",
    padding: "1px 4px",
    position: "absolute",
    borderRadius: "24%",
    right: "1px",
    top: "3px",
    color: "azure",
  };

  const { notifications, loading } = useSelector((state) => state.notificationsReducer);
  const GetNotifications = bindActionCreators(getNotifications, useDispatch());
  const ClearNotification = bindActionCreators(clearNotification, useDispatch());


  const DeleteNotification = bindActionCreators(
    deleteNotification,
    useDispatch()
  );

  const deleteNoty = (id)=>{
    DeleteNotification(id)
  }

  useEffect(() => {
    GetNotifications();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    socket.on("notifyRes", (data) => {
      GetNotifications();
    });
    // eslint-disable-next-line
  }, []);


  return (
    // <!-- Navbar -->
    <nav className="main-header navbar navbar-expand navbar-white navbar-light">
      {/* <!-- Left navbar links --> */}
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link" data-widget="pushmenu" href="." role="button">
            <i className="fas fa-bars"></i>
          </a>
        </li>
        <li className="nav-item d-none d-sm-inline-block">
          <Link to="/admin-area" className="nav-link">
            Home
          </Link>
        </li>
      </ul>

      {/* <!-- Right navbar links --> */}
      <ul className="navbar-nav ml-auto">

        {/* <!-- Notifications Dropdown Menu --> */}
        <li className="nav-item dropdown">
          <a className="nav-link" data-toggle="dropdown" href=".">
            <i className="far fa-bell"></i>

            <span className="badge-info " style={navbaradgeq}>
              {notifications.length}
            </span>
          </a>
        {!loading && <>
          <div
          onClick={(e)=>e.stopPropagation()}
            className="dropdown-menu dropdown-menu-lg dropdown-menu-right"
            style={{ textIndent: "-6px" }}
          >
            <span className="dropdown-item dropdown-header">
              {notifications.length} notifications
              {notifications.length>0 &&(<span className="float-right text-danger" onClick={()=>ClearNotification()} style={{cursor:'pointer'}}> clear </span>)}
            </span>
            <div className="dropdown-divider"></div>

            {notifications.length ? (
              notifications.map(noty => (
                <Fragment key={noty._id} >
                  {noty.type === 'cartItemChange'
                  ?(<span className="dropdown-item p-2">
                    <strong className="text-danger">
                      {noty.from.name}
                      {console.log(noty.from)
                      }
                    </strong>{" "}
                    add new item
                    <span className="text-danger" style={{ fontSize: "12px" }}>
                      {noty.data.name}
                    </span>{" "}
                    to his cart
                    <span className="float-right text-muted text-sm">
                      {format(noty.createdAt)}
                    </span>{" "}
                    <i
                      className="text-primary fa fa-times"
                      style={{cursor:'pointer'}}
                      onClick={() => {deleteNoty(noty._id)
                      
                      }}
                    >
                    </i>
                  </span>)
                  :(
                    <span className="dropdown-item p-2">
                    
                    New user registered
                    (<strong className="text-danger">
                      {noty.from.name}
                    </strong>){" "}
    
                    <span className="float-right text-muted text-sm d-block">
                      {format(noty.createdAt)}
                    </span>{" "}
                    <i
                      className="text-primary fa fa-times"
                      style={{cursor:'pointer'}}
                      onClick={() => {deleteNoty(noty._id)
                      
                      }}
                    >
                    </i>
                  </span>
                  )}
                  <div className="dropdown-divider"></div>
                </Fragment>
              ))
            ) : (
              <span className="dropdown-item dropdown-header">
                There's no Notifications
              </span>
            )}

            <a href="." className="dropdown-item dropdown-footer">
              See All Notifications
            </a>
          </div>
          </>}
        </li>
       
        <li className="nav-item">
          <a
            className="nav-link"
            data-widget="control-sidebar"
            data-controlsidebar-slide="true"
            href="."
            role="button"
          >
            <i className="fas fa-th-large"></i>
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default AdminHeader;
