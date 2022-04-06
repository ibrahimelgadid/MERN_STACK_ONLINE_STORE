import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { bindActionCreators } from 'redux';
import { addProductToCart } from '../../ReduxCycle/actions/cartActions';
import {imgServer} from "../../utilis/imageServer";

function GridProduct({product}) {

  let dispatch = useDispatch()


  let AddProductToCart = bindActionCreators(addProductToCart, dispatch);
  let navigate = useNavigate()

  let handleAddToCart = ()=>{
    let productData = {
      id:product._id,
      name:product.name,
      price:product.price
    }
    AddProductToCart(productData, navigate)
  }
  
  return (
    <div className="col-sm-6 col-md-4 col-lg-3">
      <div className="card">
        <div className="card-body text-center">
          <small className="badge bg-success float-start">-25</small>
          <img className='w-100 h-100 img-fluid' src={`${imgServer}/proImage/${product.productImage}`} alt=''/>
          <h5 className='text-info'>{product.name}</h5> 
          <small className='text-muted'>From {product.brand}, As {product.category}</small>
          <strong className="text-primary float-start mt-2">${product.price}{' '}
          <i className='fas fa-star text-warning'></i>
          <i className='fas fa-star text-warning'></i>
          <i className='fas fa-star text-warning'></i>
          <i className='fas fa-star text-warning'></i>
          <i className='far fa-star text-warning'></i>
          </strong>
          
            <div className="btn-group btn-block mt-2" role={'group'}>
              <small onClick={handleAddToCart} className='btn btn-sm btn-primary'>
                <i className='fas fa-cart-arrow-down'></i>
              </small>
              <Link to={`/product/${product._id}`} className='btn btn-sm btn-outline-secondary'>
                <i className='fas fa-info-circle'></i>
              </Link>
            </div>
        </div>
      </div>
    </div>
  )}


export default GridProduct;
