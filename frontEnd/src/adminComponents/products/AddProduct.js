import React, { useEffect, useRef, useState } from 'react'
import { Button, Card, Col, Form, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { bindActionCreators } from 'redux';
import { addNewProduct } from '../../ReduxCycle/actions/productsActions';
import { getBrands } from '../../ReduxCycle/actions/brandsActions';
import { getCategories } from '../../ReduxCycle/actions/categoriesActions';
import isEmpty from '../../utilis/isEmpty';
import classnames from "classnames";

function AddProduct() {

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [productImage, setProductImage] = useState('');
  const [errors, setErrors]  = useState('');
  let [isMounted, setIsMounted] = useState(false);


  const dispatch = useDispatch()
  let navigate = useNavigate();
  let imgRef = useRef()
  
  let errorsFromState = useSelector(state=> state.errorsReducer);
  let AddNewProduct = bindActionCreators(addNewProduct,dispatch)

  let {brands} = useSelector(state=>state.brandsReducer);
  let GetBrands = bindActionCreators( getBrands, dispatch)

  let {categories} = useSelector(state=>state.categoriesReducer);
  let GetCategories = bindActionCreators( getCategories, dispatch)


  const handleSumit = (e)=>{
    e.preventDefault();
    let productData = new FormData();
    productData.append('name', name);
    productData.append('price', price);
    productData.append('category', category);
    productData.append('brand', brand);
    productData.append('productImage', productImage);
    AddNewProduct(productData, navigate)
  }


  useEffect(() => {
    GetBrands();
    GetCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if(isMounted){

      setErrors(errorsFromState)
      
      if(!isEmpty(errorsFromState)){
        Object.values(errors).map(value=>toast.warn(value, {theme:'colored'}))
      }

    }else{setIsMounted(true)}
// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errors, errorsFromState]);

  return (
    <div>
      <Row className="justify-content-center my-4">
        <Col sm={8} xs={11} md={6}>
        <div onClick={()=>navigate(-1)} className="btn btn-sm btn-outline-dark my-4">
          <i className="fas fa-arrow-circle-left"></i> back
        </div>

          <Card className='shadow'>
            <Card.Header className="text-center">
              <h5>Add New Product</h5>
              </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSumit}>
                  <img ref={imgRef} src={'../../../images/noimage.png'} alt='' style={{width:'50px', height:'50px'}}/>

                  <Form.Group className="input-group mb-3">
                    <span className="input-group-text">Image</span>
                    <Form.Control 
                    type="file" 
                    onChange={(e)=>{
                      setProductImage(e.target.files[0]);
                      var file = e.target.files[0];
                      var reader = new FileReader();
                          reader.onload = function(e) {
                            // The file's text will be printed here
                            var content = e.target.result;
                            imgRef.current.src = content;
                          };
                          reader.readAsDataURL(file);
                    }}
                    className={classnames({'is-invalid':errors.productImage})}
                  />
                  </Form.Group>

                  <Form.Group className="input-group mb-3" >
                  <span className="input-group-text">Name</span>                    
                  <Form.Control 
                    type="text" 
                    placeholder="Enter product name" 
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                    className={classnames({'is-invalid':errors.name})}
                  />
                  </Form.Group>

                  <Form.Group className="input-group mb-3" controlId="formBasicPassword">
                  <span className="input-group-text">Price</span>                    
                  <Form.Control 
                    type="number" 
                    placeholder="Enter product price" 
                    value={price}
                    onChange={(e)=>setPrice(e.target.value)}
                    className={classnames({'is-invalid':errors.price})}
                  />
                  </Form.Group>

                  <Form.Group className="input-group mb-3" controlId="formBasicEmail">
                  <span className="input-group-text">Category</span>                    
                  <Form.Select
                    // value={category}
                    onChange={(e)=>setCategory(e.target.value)}
                    className={classnames({'is-invalid':errors.category})}
                  >
                    <option value={''}>Select Category....</option>
                    {categories.map(category => <option key={category._id} value={category.name}>{category.name}</option>)}
                  </Form.Select>
                  </Form.Group>

                  <Form.Group className="input-group mb-3" controlId="formBasicEmail">
                  <span className="input-group-text">Brand</span>                    
                  <Form.Select 
                    // value={brand}
                    onChange={(e)=>setBrand(e.target.value)}
                    className={classnames({'is-invalid':errors.brand})}
                  >
                    <option value={''}>Select Brand....</option>
                    {brands.map(brand => <option  key={brand._id}>{brand.name}</option>)}
                  </Form.Select>
                  </Form.Group>
                  
                  <Button className='col-12' variant="primary" type="submit">
                  Save
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default AddProduct
