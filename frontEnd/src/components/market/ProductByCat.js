import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { bindActionCreators } from "redux";
import { getBrands } from "../../ReduxCycle/actions/brandsActions";
import { getCategories } from "../../ReduxCycle/actions/categoriesActions";
import {
  getProducts,
  getProductsByBrand,
  getProductsByCategory,
} from "../../ReduxCycle/actions/ProductsActions";
import isEmpty from "../../utilis/isEmpty";
import Brands from "./Brands";
import Categories from "./Categories";
import { Spinner } from "react-bootstrap";

function ProductByCategory() {
  let dispatch = useDispatch();

  let { products, loading } = useSelector((state) => state.productsReducer);
  let GetProducts = bindActionCreators(getProducts, dispatch);
  let GetProductsByCategory = bindActionCreators(
    getProductsByCategory,
    dispatch
  );
  let GetProductsByBrand = bindActionCreators(getProductsByBrand, dispatch);

  let { brands } = useSelector((state) => state.brandsReducer);
  let GetBrands = bindActionCreators(getBrands, dispatch);

  let { categories } = useSelector((state) => state.categoriesReducer);
  let GetCategories = bindActionCreators(getCategories, dispatch);

  let { categoryHandle } = useParams();
  let { brandHandle } = useParams();

  useEffect(() => {
    GetProducts();
    GetBrands();
    GetCategories();
    // eslint-disable-next-line
  }, [brandHandle, categoryHandle]);

  useEffect(() => {
    if (categoryHandle) {
      GetProductsByCategory(categoryHandle);
    }
    // eslint-disable-next-line
  }, [categoryHandle]);

  useEffect(() => {
    if (brandHandle) {
      GetProductsByBrand(brandHandle);
    }
    // eslint-disable-next-line
  }, [brandHandle]);

  return (
    <div className=" ProductByCategory">
      {/* <Carousel/> */}
      <div className="row mx-2">
        <div className="col-sm-4 col-md-3 my-4">
          <Categories categories={categories} />
          <Brands brands={brands} />
        </div>
        <div className="col-sm-8 col-md-9 ">
          {isEmpty(products) && loading ? (
            <div className="text-center">
              <Spinner animation="border" role="status" />
            </div>
          ) : (
            <div className="row">
              <div className="col-12 my-2">
                <hr />
              </div>
              {products.length > 0 ? (
                products.map((product) => (
                  <div className="col-sm-6 col-md-4 col-lg-3">
                    <div className="card">
                      <div className="card-body text-center">
                        <small className="badge bg-sm bg-primary float-start">
                          ${product.price}
                        </small>
                        <small className="badge bg-success float-end">
                          -25
                        </small>
                        {/* <div className='row'> */}
                        <img
                          className="w-100 h-100 img-fluid"
                          src={product.productImage}
                          alt=""
                        />
                        {/* </div> */}
                        <h5 className="text-info">{product.name}</h5>
                        <small className="text-muted">
                          from {product.brand}, as {product.category}
                        </small>
                        <div
                          className="btn-group btn-block mt-4"
                          role={"group"}
                        >
                          <Link
                            to={`/cart/${product._id}`}
                            className="btn btn-sm btn-primary"
                          >
                            <i className="fas fa-cart-arrow-down"></i>
                          </Link>
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
                ))
              ) : (
                <div className="text-center">
                  <strong className="text-danger">
                    {" "}
                    <i className="fas fa-exclamation-circle"></i> There is no
                    products
                  </strong>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductByCategory;
