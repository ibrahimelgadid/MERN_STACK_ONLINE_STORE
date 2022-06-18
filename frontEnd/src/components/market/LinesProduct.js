import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import io from "socket.io-client";
import { addProductToCart } from "../../ReduxCycle/actions/cartActions";
import { addNewNotification } from "../../ReduxCycle/actions/notificationsActions";

import { socketConn } from "../../utilis/socket";
// import { imgServer } from "../../utilis/imageServer";
import { Spinner } from "react-bootstrap";

var socket = io(socketConn);

function LinesProduct({ product, user }) {
  const AddProductToCart = bindActionCreators(addProductToCart, useDispatch());
  const AddNewNotification = bindActionCreators(
    addNewNotification,
    useDispatch()
  );

  const [Loading, setLoading] = useState(false);

  const handleAddToCart = () => {
    const productData = {
      id: product._id,
      name: product.name,
      price: product.price,
      publisher: product.publisher,
    };
    AddProductToCart(productData, setLoading);
    //real-time notification
    socket.emit("notify", {
      data: productData,
      from: user.id,
      type: "cartItemChange",
    });

    //Add notification to database
    AddNewNotification({
      data: productData,
      from: user.id,
      type: "cartItemChange",
    });
  };
  return (
    <div className="card mb-3">
      <div className="row g-0">
        <div className="col-sm-4">
          <small className="badge bg-success float-start">-25</small>
          <img
            className="w-100 h-100 img-fluid rounded-start"
            src={product.productImage}
            alt="..."
          />
        </div>
        <div className="col-sm-8">
          <div className="card-body">
            <h5 className="text-info">{product.name}</h5>
            <p className="text-muted">
              From {product.brand}, As {product.category}
            </p>
            <strong className="text-primary float-start mt-2">
              ${product.price} <i className="fas fa-star text-warning"></i>
              <i className="fas fa-star text-warning"></i>
              <i className="fas fa-star text-warning"></i>
              <i className="fas fa-star text-warning"></i>
              <i className="far fa-star text-warning"></i>
            </strong>
            <div className="btn-group btn-block mt-4" role={"group"}>
              <small
                onClick={handleAddToCart}
                className="btn btn-sm btn-primary"
              >
                {Loading ? (
                  <Spinner animation="border" role="status" />
                ) : (
                  <i className="fas fa-cart-arrow-down"></i>
                )}
              </small>
              <Link
                to={`/product/${product._id}`}
                className="btn btn-sm btn-outline-secondary"
              >
                <i className="fas fa-info-circle"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LinesProduct;
