import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { bindActionCreators } from 'redux';
import { getProductsForAdmins } from '../../ReduxCycle/actions/productsActions';
import { getUsers } from '../../ReduxCycle/actions/membersActions';
import { getBrands } from '../../ReduxCycle/actions/brandsActions';
import { getCategories } from '../../ReduxCycle/actions/categoriesActions';
import { Link } from "react-router-dom";



function AdminArea() {

  const {users:members} = useSelector(state=>state.membersReducer);
  const GetUsers = bindActionCreators( getUsers, useDispatch())
  
  const {products} = useSelector(state=>state.productsReducer);
  const GetProducts = bindActionCreators( getProductsForAdmins, useDispatch())

  const {brands} = useSelector(state=>state.brandsReducer);
  const GetBrands = bindActionCreators( getBrands, useDispatch())

  const {categories} = useSelector(state=>state.categoriesReducer);
  const GetCategories = bindActionCreators( getCategories, useDispatch())



  useEffect(() => {
    GetProducts();
    GetUsers();
    GetBrands();
    GetCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
        <div className="row mx-2">
          <div className="col-lg-3 col-6">
            <div className="small-box bg-info">
              <div className="inner">
                <h3>{products.length}</h3>

                <p>Products</p>
              </div>
              <div className="icon">
                <i className="ion ion-bag"></i>
              </div>
              <Link to="/admin-products" className="small-box-footer">More info <i className="fas fa-arrow-circle-right"></i></Link>
            </div>
          </div>
          <div className="col-lg-3 col-6">
            <div className="small-box bg-success">
              <div className="inner">
                <h3>{members.length}</h3>

                <p>Users</p>
              </div>
              <div className="icon">
                <i className="ion ion-stats-bars"></i>
              </div>
              <Link to="/admin-users" className="small-box-footer">More info <i className="fas fa-arrow-circle-right"></i></Link>
            </div>
          </div>
          <div className="col-lg-3 col-6">
            <div className="small-box bg-warning text-white">
              <div className="inner">
                <h3>{brands.length}</h3>

                <p>Brands</p>
              </div>
              <div className="icon">
                <i className="ion ion-person-add"></i>
              </div>
              <Link to="/admin-brands" className="small-box-footer text-white">More info <i className="fas fa-arrow-circle-right"></i></Link>
            </div>
          </div>
          <div className="col-lg-3 col-6">
            <div className="small-box bg-danger">
              <div className="inner">
                <h3>{categories.length}</h3>

                <p>Categories</p>
              </div>
              <div className="icon">
                <i className="ion ion-pie-graph"></i>
              </div>
              <Link to="/admin-categories" className="small-box-footer">More info <i className="fas fa-arrow-circle-right"></i></Link>
            </div>
          </div>
        </div>
  )
}

export default AdminArea
