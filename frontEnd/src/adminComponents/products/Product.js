import React, { useEffect, useState} from 'react'
import { Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { addGallaryImages, deleteGallaryImage, getProduct } from '../../ReduxCycle/actions/productsActions';
import isEmpty from '../../utilis/isEmpty';
import Moment from 'react-moment';
import { DropzoneArea } from 'material-ui-dropzone';
import {imgServer} from "../../utilis/imageServer";



function Product() {


  const [productImage, setProductImage] = useState('')

  const {product} = useSelector(state=>state.productsReducer)
  const dispatch = useDispatch();
  const GetProduct = bindActionCreators(getProduct,dispatch);
  const DeleteImage = bindActionCreators(deleteGallaryImage,dispatch);
  const AddGallaryImages = bindActionCreators(addGallaryImages, useDispatch())
  const {productId} = useParams();
  const navigate = useNavigate()
  

  // const 

  useEffect(() => {
    GetProduct(productId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  useEffect(()=>{
    
    if(productImage){
      const productImages= new FormData();
      for (const key of Object.keys(productImage)) {
        productImages.append('gallary', productImage[key])
    }
      console.log(...productImages);
      AddGallaryImages(productImages,productId, navigate)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productImage])

  return (
    <div>
      <div className="row justify-content-center my-4">
        <div className="col-11 col-md-10">
          <button 
          onClick={()=>navigate(-1)}
          className='btn btn-dark d-block mb-2'>back</button>
          {
          isEmpty(product)
          ?
          (<Spinner/>)
          :
          (<div className="card shadow">
            <div className="card-header text-center">
              <h3>{product.name}</h3>
            </div>
            <div className="card-body">
            <div className="col-sm-4 text-center my-4">
                <img alt='' style={{width:'150px', height:'150px'}}
                  className='img-fluid rounded-circle img-thumbnail mx-auto' 
                  src={product.productImage==='noimage.png'?`../../../images/${product.productImage}`:
                  `${imgServer}/proImage/${product.productImage}`} 
                />
              </div>
              <p><strong><i className='fas fa-user'></i> Name:- </strong> <small className='text-muted'>{product.name}</small></p>
              <p><strong><i className='fas fa-envelope'></i> Category:- </strong> <small className='text-muted'>{product.category}</small></p>
              <p><strong><i className='fas fa-user-tag'></i> Brand:- </strong> <small className='text-muted'>{product.brand}</small></p>
              <p><strong><i className='fas fa-stopwatch'></i> Created At:- </strong> <small className='text-muted'>
                <Moment format="YYYY/MM/DD - HH:mm">
                {product.createdAt}
                </Moment></small></p>
                {product.productGallary.length>0 &&(

                  <p>
                    <strong><i className='fas fa-img'></i> Gallary:- </strong>
                    {product.productGallary.map(img=>(
                      <>
                      <span  className="position-relative">
                      <img 
                        alt={img}
                        className='img-fluid rounded-circle img-thumbnail mx-auto' 
                        style={{width:'50px', height:'50px'}}
                        src={`${imgServer}/gallary/${product._id}/${img}`}
                      />
                        <span
                          onClick={()=>DeleteImage(product._id, img)}
                          style={{cursor:'pointer'}} 
                          className="position-absolute top-0 start-0 fs-8 translate-middle badge rounded-pill bg-danger">
                          <i className="fa fa-times"></i>
                        </span>
                      </span>
                      </>
                    ) )}
                  </p>
                )}

              {/* <p><strong><i className='fas fa-address-card'></i> Address:- </strong> <small className='text-muted'>{user.address?user.address:'This member has no address'}</small></p> */}
                  <div className="container">
                    {product.productGallary.length<7 &&(

                    <DropzoneArea
                      acceptedFiles={['image/*']}
                      filesLimit={6}
                      dropzoneText={"Drag and drop an image here or click"}
                      onDrop={(files) => setProductImage(files)}
                    />
                    )}
                  </div>
            </div>
          </div>
          )
          }

        </div>
      </div>
    </div>
  )
}

export default Product
