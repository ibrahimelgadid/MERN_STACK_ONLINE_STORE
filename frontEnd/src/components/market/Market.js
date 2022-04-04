import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import { bindActionCreators } from "redux";
import { getBrands } from "../../ReduxCycle/actions/brandsActions";
import { getCategories } from "../../ReduxCycle/actions/categoriesActions";
import {
  getProducts,
  getProductsByBrand,
  getProductsByCategory,
  getProductsBySearch,
} from "../../ReduxCycle/actions/productsActions";
import isEmpty from "../../utilis/isEmpty";

import GridProduct from "./GridProduct";
import LinesProduct from "./LinesProduct";
import classNames from "classnames";
import ModalSearch from "./ModalSearch";
import Sort from "./Sort";
import { Pagination } from "react-bootstrap";

function Market() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page");
  const [grid, setGrid] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  const { products, loading, productsCount } = useSelector(
    (state) => state.productsReducer
  );
  const { user } = useSelector((state) => state.authReducer);
  const GetProducts = bindActionCreators(getProducts, useDispatch());
  const GetProductsByCategory = bindActionCreators(
    getProductsByCategory,
    useDispatch()
  );
  const GetProductsByBrand = bindActionCreators(
    getProductsByBrand,
    useDispatch()
  );
  const GetProductsBySearch = bindActionCreators(
    getProductsBySearch,
    useDispatch()
  );

  const { brands } = useSelector((state) => state.brandsReducer);
  const GetBrands = bindActionCreators(getBrands, useDispatch());

  const { categories } = useSelector((state) => state.categoriesReducer);
  const GetCategories = bindActionCreators(getCategories, useDispatch());

  const { categoryHandle } = useParams();
  const { brandHandle } = useParams();



  useEffect(() => {
    setCurrentPage(page);
    // eslint-disable-next-line
  }, [page]);


  const pages = new Array(productsCount).fill(null).map((p, i) => p);
  
  

  useEffect(() => {
    if (isEmpty(brandHandle) && isEmpty(categoryHandle)) {
      GetProducts(currentPage);
    }
    GetCategories();
    GetBrands();
    // eslint-disable-next-line
  }, [brandHandle, categoryHandle, currentPage]);

  useEffect(() => {
    if (!isEmpty(categoryHandle)) {
      GetProductsByCategory(categoryHandle);
    }
    // eslint-disable-next-line
  }, [categoryHandle]);

  useEffect(() => {
    if (!isEmpty(brandHandle)) {
      GetProductsByBrand(brandHandle);
    }
    // eslint-disable-next-line
  }, [brandHandle]);

  useEffect(() => {
    if (isMounted) {
      const searchData = { search };
      GetProductsBySearch(searchData);
    } else {
      setIsMounted(true);
    }
    // eslint-disable-next-line
  }, [search]);


  
  return (
    <div className=" market">
      {/* <Carousel/> */}
      <div className="row mx-2">
        <div className="col-12 ">
          {isEmpty(products) && loading ? (
            <div className="spinner-border my-4" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          ) : (
            <div className="my-4">
              <div className="row">
                {/* search modal trigger */}
                <div className="col-3">
                  <div className="btn-group">
                    <small
                      className="btn btn-outline-primary"
                      data-bs-toggle="modal"
                      data-bs-target="#modelId"
                    >
                      <i className="fas fa-sliders-h"></i>
                    </small>
                    <small
                      className="btn btn-outline-primary dropdown-toggle"
                      id="triggerSortId"
                      data-bs-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <i className="fas fa-sort-alpha-up"></i>
                    </small>
                    <Sort />
                  </div>
                </div>

                {/* modal search */}
                <ModalSearch brands={brands} categories={categories} />

                <div className="col-6">
                  <form className="float-none">
                    <div className="input-group mb-3 ">
                      <span className="input-group-text" id="prefixId">
                        <i className="fas fa-search"></i>
                      </span>
                      <input
                        value={search}
                        onChange={(e) => {
                          setSearch(e.target.value);
                        }}
                        type="text"
                        className="form-control"
                        placeholder="Search product"
                      />
                    </div>
                  </form>
                </div>
                <div className="col-3">
                  <div
                    className="btn-group float-end"
                    role="group"
                    aria-label=""
                  >
                    <small
                      onClick={() => setGrid(true)}
                      className={classNames("btn btn-outline-primary", {
                        "bg-primary text-light": grid,
                      })}
                    >
                      <i className="fas fa-th"></i>
                    </small>
                    <small
                      onClick={() => setGrid(false)}
                      className={classNames("btn btn-outline-primary", {
                        "bg-primary text-light": !grid,
                      })}
                    >
                      <i className="fas fa-align-justify"></i>
                    </small>
                  </div>
                </div>
              </div>

              {products.length > 0 ? (
                <div className="row">
                  <div className="col-12"></div>
                  <div className="col-12 my-2">
                    <hr />
                  </div>
                  {products.map((product) =>
                    grid ? (
                      <GridProduct
                        key={product._id}
                        product={product}
                        user={user}
                      />
                    ) : (
                      <LinesProduct
                        key={product._id}
                        product={product}
                        user={user}
                      />
                    )
                  )}
                  

                    <Pagination size="sm">
                      {pages.map((p, i) => (
                        <Pagination.Item
                          active={page === String(i)}
                          key={i}
                          onClick={() => setSearchParams({ page: i })}
                        >
                          {i + 1}
                        </Pagination.Item>
                      ))}
                    </Pagination>
                  
                  
                </div>
              ) : (
                <strong className="text-danger">
                  {" "}
                  <i className="fas fa-exclamation-circle"></i> There is no
                  products
                </strong>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Market;
