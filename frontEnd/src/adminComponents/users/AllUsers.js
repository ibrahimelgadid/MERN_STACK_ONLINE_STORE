import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { deleteUser, getUsers } from "../../ReduxCycle/actions/membersActions";
import isEmpty from "../../utilis/isEmpty";
import { Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { imgServer } from "../../utilis/imageServer";

function AllUsers() {
  const { users, loading } = useSelector((state) => state.membersReducer);
  const { user: authUser } = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  const GetUsers = bindActionCreators(getUsers, dispatch);
  const DeleteUser = bindActionCreators(deleteUser, dispatch);
  const navigate = useNavigate();

  const handleDelete = (user_id) => {
    DeleteUser(user_id);
  };

  const usersData = !isEmpty(users) ? (
    <table className="table table-striped table-bordered my-4 text-center">
      <thead>
        <tr>
          <th>ID</th>
          <th>Avatar</th>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, i) => (
          <tr key={user._id}>
            <td>{i + 1}</td>
            <td>
              <img
                className="img-circle  elevation-2"
                src={
                  user.avatar === "noimage.png"
                    ? `../../../images/${user.avatar}`
                    : `${imgServer}/userAvatar/${user.avatar}`
                }
                style={{ width: "40px", height: "40px" }}
                alt={user.name}
              />
            </td>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>
              {authUser.role === "superAdmin" && user.role !== "superAdmin" ? (
                <>
                  <i
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDelete(user._id)}
                    className="far fa-times-circle text-danger mr-2"
                  ></i>

                  <Link to={`/admin-users/role/${user._id}`}>
                    <i className="fas fa-edit text-primary mr-2"></i>
                  </Link>
                </>
              ) : null}

              <Link to={user._id}>
                <i className="fas fa-info-circle text-info"></i>
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <Spinner animation="border" role="status" />
  );

  useEffect(() => {
    GetUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="users container">
      <h3 className="text-center text-info mt-4">Members Show</h3>
      <div
        onClick={() => navigate(-1)}
        className="btn btn-sm btn-outline-dark my-4 float-left"
      >
        <i className="fas fa-arrow-circle-left"></i> back
      </div>
      {!loading ? (
        usersData
      ) : (
        <div className="text-center">
          <Spinner animation="border" role="status" />
        </div>
      )}
    </div>
  );
}

export default AllUsers;
