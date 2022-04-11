import React, { useEffect } from 'react'
import { Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { getProduct } from '../../ReduxCycle/actions/productsActions';
import isEmpty from '../../utilis/isEmpty';
import Moment from 'react-moment';
import Fancybox from "./fancybox/Fancybox";
import {imgServer} from "../../utilis/imageServer";



function Product() {

  const {product, loading} = useSelector(state=>state.productsReducer)
  const dispatch = useDispatch();
  const GetProduct = bindActionCreators(getProduct,dispatch);
  const {productID} = useParams();
  const navigate = useNavigate()
  
  useEffect(() => {
    GetProduct(productID)
    // eslint-disable-next-line
  },[])

  return (
    <div>
      <div className="row justify-content-center my-4">
        <div className="col-11 col-md-10">
          <button 
          onClick={()=>navigate(-1)}
          className='btn btn-sm btn-outline-dark d-block mb-2'><i className='fas fa-arrow-circle-left'></i> back</button>
          {
          loading && isEmpty(product)
          ?
          <div className="spinner-border my-4" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          :
          !isEmpty(product)?
          (<div className="card shadow">
            <div className="card-header text-center">
              <h3>{product.name}</h3>
            </div>
            <div className="card-body">
            <div className="col-sm-4 text-center my-4">
                <img style={{width:'150px', height:'150px'}} alt={product.productImage}
                  className='img-fluid rounded-circle img-thumbnail mx-auto' 
                  src={product.productImage==='noimage.png'?`../../../images/${product.productImage}`:
                  `${imgServer}/proImage/${product.productImage}`} 
                />
              </div>
              <p><strong><i className='fas fa-user'></i> Name:- </strong> <small className='text-muted'>{product.name}</small></p>
              <p><strong><i className='fas fa-envelope'></i> Category:- </strong> <small className='text-muted'>{product.category}</small></p>
              <p><strong><i className='fas fa-user-tag'></i> Brand:- </strong> <small className='text-muted'>{product.brand}</small></p>
              <p><strong><i className='fas fa-money-bill'></i> Price:- </strong> <small className=' badge bg-danger '>${product.price}</small></p>
              <p><strong><i className='fas fa-user-tag'></i> Publisher:- </strong> <small className='text-muted'>{product.publisher.name}</small></p>
              <p><strong><i className='fas fa-calender'></i> Created at:- </strong> <small className='text-muted'><Moment format="YYYY/MM/DD - HH:mm">
                {product.createdAt}
                </Moment></small>
              </p>
              <Fancybox>
              {product.productGallary.length>0 &&(
                <p>
                  <strong><i className='fas fa-img'></i> Gallary:- </strong>
                  {product.productGallary.map(img=>(

                    <span data-fancybox="gallery"  data-src={`${imgServer}/gallary/${product._id}/${img}`}>
                      <img
                        alt=""
                        className='img-fluid rounded-circle img-thumbnail mx-auto' 
                        style={{width:'50px', height:'50px', cursor:'pointer'}}
                        src={`${imgServer}/gallary/${product._id}/${img}`} 
                      />
                    </span>

                  ) )}
                </p>
                )}              
            </Fancybox>
              <div class="btn-group" role="group" aria-label="Basic example">
                <button onClick={()=>navigate(-1)} type="button" class="btn btn-outline-secondary"><i className='fas fa-arrow-circle-left'></i></button>
                <button  type="button" class="btn btn-outline-primary"><i className='fas fa-cart-arrow-down'></i></button>
              </div>
            </div>
          </div>
          ):(
            <strong className="text-danger">
            {" "}
            <i className="fas fa-exclamation-circle"></i> There is no
            product for this id
          </strong>
          )
          }

        </div>
      </div>
    </div>
  )
}

export default Product
