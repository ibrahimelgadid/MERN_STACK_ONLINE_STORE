import React, { useEffect, useState } from "react";
import { Button, Col, Modal, Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { bindActionCreators } from "redux";
import isEmpty from "../../utilis/isEmpty";
import { editOrder, getOrder } from "../../ReduxCycle/actions/ordersAction";

function Order() {
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState(0);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { order, loading } = useSelector((state) => state.ordersReducer);
  const GetOrder = bindActionCreators(getOrder, useDispatch());
  const EditOrder = bindActionCreators(editOrder, useDispatch());
  const { orderID } = useParams();
  const navigate = useNavigate();

  const handleChangeStatus = (e) => {
    e.preventDefault();
    EditOrder({ orderID, status });
    handleClose();
  };

  useEffect(() => {
    GetOrder(orderID);
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
          {isEmpty(order) && loading ? (
            <div className="text-center">
              <Spinner animation="border" role="status" />
            </div>
          ) : !isEmpty(order) ? (
            <div className="card shadow">
              <div className="card-header text-center">
                <h3>{order.orderOwner.name}'s Orders</h3>
              </div>
              <div className="card-body">
                <Row>
                  <Col sm={6}>
                    <p>
                      <strong>
                        <i className="fas fa-user"></i> Order Owner:-{" "}
                      </strong>{" "}
                      <small className="text-muted">
                        {order.orderOwner.name}
                      </small>
                    </p>
                    <p>
                      <strong>
                        <i className="fas fa-envelope"></i> Email:-{" "}
                      </strong>{" "}
                      <small className="text-muted">{order.email}</small>
                    </p>
                    <p>
                      <strong>
                        <i className="fas fa-user-tag"></i> Phone:-{" "}
                      </strong>{" "}
                      <small className="text-muted">{order.phone}</small>
                    </p>
                    <p>
                      <strong>
                        <i className="fas fa-stopwatch"></i> Address:-{" "}
                      </strong>{" "}
                      <small className="text-muted">{order.address}</small>
                    </p>
                    <p>
                      <strong>
                        <i className="fas fa-stopwatch"></i> Created at:-{" "}
                      </strong>{" "}
                      <small className="text-muted">{order.createdAt}</small>
                    </p>
                    <p>
                      <strong>
                        <i className="fas fa-stopwatch"></i> Status:-{" "}
                      </strong>
                      {order.status === "0" ? (
                        <i className="fas fa-exclamation-circle text-warning">
                          {" "}
                          Pendeng
                        </i>
                      ) : order.status === "3" ? (
                        <i className="fas fa-check-circle text-success">
                          {" "}
                          Completed
                        </i>
                      ) : order.status === "1" ? (
                        <i className="fas fa-history text-primary">
                          {" "}
                          Processing
                        </i>
                      ) : (
                        <i className="fas fa-times-circle text-danger">
                          {" "}
                          Cancelled
                        </i>
                      )}
                      <i
                        className="text-muted fa fa-edit"
                        onClick={handleShow}
                        style={{ cursor: "pointer" }}
                      ></i>
                    </p>
                    {/* change status modal */}
                    <Modal centered show={show} onHide={handleClose}>
                      <Modal.Header closeButton>
                        <Modal.Title>Modal heading</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <form onSubmit={handleChangeStatus}>
                          <div className="mb-3 input-group">
                            <span className="input-group-text">
                              <i className="fas fa-user-tag"></i>
                            </span>
                            <select
                              className="form-select"
                              value={status}
                              onChange={(e) => setStatus(e.target.value)}
                            >
                              <option value={0}>Pending</option>
                              <option value={1}>Proccessing</option>
                              <option value={2}>Cancelled</option>
                              <option value={3}>Completed</option>
                            </select>
                          </div>
                          <button
                            className="btn btn-primary col-12"
                            type="submit"
                          >
                            Change
                          </button>
                        </form>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                          Close
                        </Button>
                      </Modal.Footer>
                    </Modal>
                  </Col>
                  <Col sm={6}>
                    {/* cart items */}
                    <div className="card">
                      <div className="card-header">
                        <i className="fas fa-cart-arrow-down"></i> Cart{" "}
                        <span className="badge bg-secondary float-right">
                          {order.cart.totalQty}
                        </span>
                      </div>
                      <ul className="list-group list-group-flush">
                        {order.cart.selectedProduct.map((pro) => (
                          <li
                            key={pro._id}
                            className="list-group-item d-flex justify-content-between lh-sm"
                          >
                            <div>
                              <h6 className="my-0">{pro.name}</h6>
                              <small className="text-muted">
                                Brief description
                              </small>
                            </div>
                            <span className="text-muted">${pro.price}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <strong className="text-danger">
                {" "}
                <i className="fas fa-exclamation-circle"></i> There is no order
                for this id
              </strong>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Order;
