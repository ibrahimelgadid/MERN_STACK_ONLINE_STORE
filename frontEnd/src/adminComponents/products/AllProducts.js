import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import {
  deleteProduct,
  getProductsForAdmins,
} from "../../ReduxCycle/actions/productsActions";
import isEmpty from "../../utilis/isEmpty";
import { Link, useNavigate } from "react-router-dom";
// import { imgServer } from "../../utilis/imageServer";
import { Spinner } from "react-bootstrap";

function AllProducts() {
  const { user } = useSelector((state) => state.authReducer);
  const { products, loading } = useSelector((state) => state.productsReducer);
  const GetProducts = bindActionCreators(getProductsForAdmins, useDispatch());
  const DeleteProduct = bindActionCreators(deleteProduct, useDispatch());
  const navigate = useNavigate();

  const handleDelete = (id) => {
    DeleteProduct(id);
  };

  const productsData =
    isEmpty(products) || loading ? (
      <div className="text-center">
        <Spinner animation="border" role="statu" />
      </div>
    ) : products.length > 0 ? (
      <table className="table table-striped table-bordered my-4">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Image</th>
            <th>Price</th>
            <th>Publisher</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, i) => (
            <tr key={product._id}>
              <td>{i + 1}</td>
              <td>{product.name}</td>
              <td>
                <img
                  className="img-circle  elevation-2"
                  src={product.productImage}
                  style={{ width: "40px", height: "40px" }}
                  alt={product.name}
                />
              </td>
              <td>{product.price}$</td>
              <td>
                {product.publisher ? product.publisher.name : "Deleted user"}
              </td>
              <td>
                {user.id === product.publisher._id.toString() ? (
                  <>
                    <i
                      style={{ cursor: "pointer" }}
                      onClick={() => handleDelete(product._id)}
                      className="far fa-times-circle text-danger mr-2"
                    ></i>
                    <Link to={`/admin-product/edit/${product._id}`}>
                      <i className="fas fa-edit text-primary mr-2"></i>
                    </Link>
                    <Link to={`/admin-product/${product._id}`}>
                      <i className="fas fa-info-circle text-info"></i>
                    </Link>
                  </>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <div className="text-center">
        <strong className="text-danger">
          {" "}
          <i className="fas fa-exclamation-circle"></i> There is no products
        </strong>
      </div>
    );

  useEffect(() => {
    GetProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="products container text-center"
      style={{ minHeight: "200px" }}
    >
      <h3 className="text-center text-info mt-4">Products Show</h3>
      <div
        onClick={() => navigate(-1)}
        className="btn btn-sm btn-outline-dark my-4 float-left"
      >
        <i className="fas fa-arrow-circle-left"></i> back
      </div>
      <Link
        to={"/admin-add-product"}
        className="btn btn-sm btn-outline-dark my-4 float-right"
      >
        <i className="fas fa-plus-circle"></i> New
      </Link>
      {productsData}
    </div>
  );
}

export default AllProducts;
