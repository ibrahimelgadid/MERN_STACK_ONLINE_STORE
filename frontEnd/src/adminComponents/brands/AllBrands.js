import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from 'redux';
import isEmpty from '../../utilis/isEmpty';
import { Modal, Spinner } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { deleteBrand, getBrands } from '../../ReduxCycle/actions/brandsActions';
import AddBrand from "./AddBrand";
import EditBrand from './EditBrand';

function AllBrands() {

  const [show, setShow] = useState(false);
  const [brandID, setBrandID] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showEdit, setShowEdit] = useState(false);
  const handleCloseEdit = () => setShowEdit(false);
  const handleShowEdit = () => setShowEdit(true);

 const {brands, loading} = useSelector(state=>state.brandsReducer)
 const dispatch = useDispatch();
 const Getbrands = bindActionCreators(getBrands, dispatch)
 const DeleteBrand = bindActionCreators( deleteBrand, dispatch)
 const navigate = useNavigate()



 const handleDelete = (id)=>{
    DeleteBrand(id)
  }


 const brandsData = !isEmpty(brands)?(
    <table className="table table-striped table-bordered my-4">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Publisher</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((Brand,i)=>(
        
            <tr key={Brand._id}>
              <td >{i+1}</td>
              <td>{Brand.name}</td>

              <td>{Brand.description}</td>
              <td>{Brand.publisher?Brand.publisher.name:'Deleted user'}</td>

              <td>
                <i style={{cursor:'pointer'}} onClick={()=>handleDelete(Brand._id)} className='far fa-times-circle text-danger'></i>

                <i style={{cursor:'pointer'}} onClick={()=>{setBrandID(Brand._id);handleShowEdit()}}  className="fas fa-edit text-primary ml-2"></i> 
              </td>

            </tr>
            ))}
          </tbody>
        </table>
  )
  :<div className='text-center'>
    <strong className='text-danger'> <i className='fas fa-exclamation-circle'></i> There is no brands</strong>;
  </div>


  useEffect(() => {
    Getbrands();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='brands container mt-4'>
      <h3 className='text-center text-info'>brands Show</h3>
        <div onClick={()=>navigate(-1)} className="btn btn-sm btn-outline-dark my-4 float-left">
          <i className="fas fa-arrow-circle-left"></i> back
        </div>
  
        <button  className="btn btn-sm btn-outline-dark my-4 float-right" onClick={handleShow}>
          <i className="fas fa-plus-circle"></i> New 
        </button>
        {/* modal for add new Brand */}
        <Modal  show={show} onHide={handleClose}>
          <Modal.Header closeButton>
          </Modal.Header>
          <Modal.Body>
            <AddBrand handleClose={handleClose} />
          </Modal.Body>
        </Modal>

        {/* modal for edit exist Brand */}
        <Modal  show={showEdit} onHide={handleCloseEdit}>
          <Modal.Header closeButton>
          </Modal.Header>
          <Modal.Body>
            <EditBrand handleCloseEdit={handleCloseEdit} brandID={brandID}/>
          </Modal.Body>
        </Modal>

        {!loading?brandsData:<div className='text-center'><Spinner animation="border" role="status" /></div>}
    </div>
  )
}

export default AllBrands
