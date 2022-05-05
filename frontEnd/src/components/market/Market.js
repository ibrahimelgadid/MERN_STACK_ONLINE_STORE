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
import { Pagination, Spinner } from "react-bootstrap";
// import Carousel from "./Carousel";

function Market() {
  const [searchParams, setSearchParams] = useSearchParams({
    page: 1,
    search: "",
  });
  const [grid, setGrid] = useState(true);
  const [searchWord, setSearchWord] = useState("");
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

  const pageParam = searchParams.get("page");
  const searchParam = searchParams.get("search");
  const pagesNumber = Array(productsCount).fill("");

  const { categoryHandle } = useParams();
  const { brandHandle } = useParams();

  // get all products without search or filter word
  useEffect(() => {
    if (isEmpty(searchParam)) {
      GetProducts(pageParam);
    }
    // eslint-disable-next-line
  }, [pageParam]);
  useEffect(() => {
    GetCategories();
    GetBrands();
    // eslint-disable-next-line
  }, []);

  // change searchParams when search word changed
  useEffect(() => {
    setSearchParams({
      page: 1,
      search: searchWord,
    });
    // eslint-disable-next-line
  }, [searchWord]);

  useEffect(() => {
    GetProductsBySearch(searchParam, pageParam);
    // eslint-disable-next-line
  }, [searchWord, searchParams]);

  return (
    <div className=" market">
      {/* <Carousel/> */}
      <div className="row mx-2">
        <div className="col-12 ">
          {isEmpty(products) && loading ? (
            <div className="text-center">
              <Spinner animation="border" role="status" />
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
                        value={searchWord}
                        onChange={(e) => {
                          setSearchWord(e.target.value);
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
                    {pagesNumber.map((p, i) => (
                      <Pagination.Item
                        active={pageParam === String(i + 1)}
                        key={i}
                        onClick={() =>
                          searchParam
                            ? setSearchParams({
                                page: i + 1,
                                search: searchParam,
                              })
                            : setSearchParams({
                                page: i + 1,
                              })
                        }
                      >
                        {i + 1}
                      </Pagination.Item>
                    ))}
                  </Pagination>
                </div>
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

export default Market;
