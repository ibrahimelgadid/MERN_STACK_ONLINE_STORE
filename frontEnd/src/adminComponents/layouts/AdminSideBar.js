import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from "react-router-dom"
import { bindActionCreators } from 'redux';
import { getBrands } from '../../ReduxCycle/actions/brandsActions';
import { getCategories } from '../../ReduxCycle/actions/categoriesActions';
import { getUsers } from '../../ReduxCycle/actions/membersActions';
import { getProducts } from '../../ReduxCycle/actions/productsActions';
import {imgServer} from "../../utilis/imageServer";


export default function AdminSideBar() {

  const dispatch = useDispatch();

  const {users:members} = useSelector(state=>state.membersReducer);
  const {user} = useSelector(state=>state.authReducer);

  const GetUsers = bindActionCreators( getUsers, dispatch)
  
  const {products} = useSelector(state=>state.productsReducer);
  const GetProducts = bindActionCreators( getProducts, dispatch)

  const {brands} = useSelector(state=>state.brandsReducer);
  const GetBrands = bindActionCreators( getBrands, dispatch)

  const {categories} = useSelector(state=>state.categoriesReducer);
  const GetCategories = bindActionCreators( getCategories, dispatch)

  useEffect(() => {
    GetProducts();
    GetUsers();
    GetBrands();
    GetCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div>
      <aside className="main-sidebar sidebar-dark-primary elevation-4" style={{minHeight:"650px"}}>
        <a href="/" target={"_blank"} className="brand-link">
          <img src="../../logo192.png" alt="AdminLTE Logo" className="brand-image img-circle elevation-3" style={{opacity: ".8"}}/>
          <span className="brand-text font-weight-light">MERN STORE</span>
        </a>

        <div className="sidebar">
          <div className="user-panel mt-3 pb-3 mb-3 d-flex">
            <div className="image">
              <img alt={user.name}
                className='img-circle elevation-2' 
                style={{width:'50px', height:'50px'}}
                src={user.avatar==='noimage.png'?`../../../images/${user.avatar}`:
                  `${imgServer}/userAvatar/${user.avatar}`} />
            </div>
            <div className="info ">
              <Link to="#" >{user.name}</Link>
            </div>
          </div>


          <nav className="mt-2">
            <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
              

              
              {/* ////////////////////////////////////////////////// */}
              <li className="nav-item">
                <Link to="/admin-area" className="nav-link">
                  <i className="nav-icon fas fa-house-damage"></i>
                  <p>
                    Dashboard
                  </p>
                </Link>
              </li>


              {/* ////////////////////////////////////////////////// */}
              <li className="nav-item">
                <Link to="#" className="nav-link">
                  <i className="nav-icon fas fa-users"></i>
                  <p>
                    Users
                    <i className="fas fa-angle-left right"></i>
                    <span className="badge badge-info right">{members.length}</span>
                  </p>
                </Link>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <Link to="admin-users" className="nav-link">
                      <i className="far fa-circle nav-icon"></i>
                      <p>All Users</p>
                    </Link>
                  </li>
                </ul>
              </li>


              {/* ////////////////////////////////////////////////// */}
              <li className="nav-item">
                <Link to="#" className="nav-link">
                  <i className="nav-icon fas fa-copy"></i>
                  <p>
                    Products
                    <i className="fas fa-angle-left right"></i>
                    <span className="badge badge-info right">{products.length}</span>
                  </p>
                </Link>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <Link to="admin-products" className="nav-link">
                      <i className="far fa-circle nav-icon"></i>
                      <p>All Products</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="admin-add-product" className="nav-link">
                      <i className="far fa-circle nav-icon"></i>
                      <p>Add Product </p>
                    </Link>
                  </li>
                </ul>
              </li>

              {/* ////////////////////////////////////////////////// */}
              <li className="nav-item">
                <Link to="#" className="nav-link">
                  <i className="nav-icon fas fa-copy"></i>
                  <p>
                    Categories
                    <i className="fas fa-angle-left right"></i>
                    <span className="badge badge-info right">{categories.length}</span>
                  </p>
                </Link>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <Link to="admin-categories" className="nav-link">
                      <i className="far fa-circle nav-icon"></i>
                      <p>All Categories</p>
                    </Link>
                  </li>

                </ul>
              </li>

              {/* ////////////////////////////////////////////////// */}
              <li className="nav-item">
                <Link to="#" className="nav-link">
                  <i className="nav-icon fas fa-copy"></i>
                  <p>
                    Brands
                    <i className="fas fa-angle-left right"></i>
                    <span className="badge badge-info right">{brands.length}</span>
                  </p>
                </Link>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <Link to="admin-brands" className="nav-link">
                      <i className="far fa-circle nav-icon"></i>
                      <p>All Brands</p>
                    </Link>
                  </li>
                </ul>
              </li>

              {/* ////////////////////////////////////////////////// */}
              <li className="nav-item">
                <Link to="#" className="nav-link">
                  <i className="nav-icon fas fa-copy"></i>
                  <p>
                    Sliders
                    <i className="fas fa-angle-left right"></i>
                    <span className="badge badge-info right">6</span>
                  </p>
                </Link>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <Link to="admin-sliders" className="nav-link">
                      <i className="far fa-circle nav-icon"></i>
                      <p>All Sliders</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="admin-add-slider" className="nav-link">
                      <i className="far fa-circle nav-icon"></i>
                      <p>Add Slider </p>
                    </Link>
                  </li>
                </ul>
              </li>

              {/* ////////////////////////////////////////////////// */}
              <li className="nav-item">
                <Link to="#" className="nav-link">
                  <i className="nav-icon fas fa-copy"></i>
                  <p>
                    Orders
                    <i className="fas fa-angle-left right"></i>
                    {/* <span className="badge badge-info right">{orders.length}</span> */}
                  </p>
                </Link>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <Link to="admin-orders" className="nav-link">
                      <i className="far fa-circle nav-icon"></i>
                      <p>All Orders</p>
                    </Link>
                  </li>
                  
                </ul>
              </li>

            </ul>
          </nav>
        </div>
        
      </aside>
    </div>
  )
}
