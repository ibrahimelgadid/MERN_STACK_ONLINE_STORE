import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from 'redux';
import isEmpty from '../../utilis/isEmpty';
import { Modal, Spinner } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { deleteCategory, getCategories } from '../../ReduxCycle/actions/categoriesActions';
import AddCategory from "./AddCategory";
import EditCategory from './EditCategory';

function AllCategories() {

  const [show, setShow] = useState(false);
  const [categoryID, setCategoryID] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showEdit, setShowEdit] = useState(false);
  const handleCloseEdit = () => setShowEdit(false);
  const handleShowEdit = () => setShowEdit(true);

  let {categories} = useSelector(state=>state.categoriesReducer)
  let dispatch = useDispatch();
  let GetCategories = bindActionCreators(getCategories, dispatch)
  let DeleteCategory = bindActionCreators( deleteCategory, dispatch)
  let navigate = useNavigate()



  let handleDelete = (id)=>{
    DeleteCategory(id)
  }


  let categoriesData = !isEmpty(categories)?(
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
            {categories.map((category,i)=>(
        
            <tr key={category._id}>
              <td >{i+1}</td>
              <td>{category.name}</td>

              <td>{category.description}</td>
              <td>{category.publisher?category.publisher.name:'Deleted user'}</td>

              <td>
                <i style={{cursor:'pointer'}} onClick={()=>handleDelete(category._id)} className='far fa-times-circle text-danger'></i>

                <i style={{cursor:'pointer'}} onClick={()=>{setCategoryID(category._id);handleShowEdit()}}  className="fas fa-edit text-primary ml-2"></i> 
              </td>

            </tr>
            ))}
          </tbody>
        </table>
  ):<Spinner animation="border" role="status" />;


  useEffect(() => {
    GetCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='categories container mt-4'>
      <h3 className='text-center text-info'>Categories Show</h3>
        <div onClick={()=>navigate(-1)} className="btn btn-sm btn-outline-dark my-4 float-left">
          <i className="fas fa-arrow-circle-left"></i> back
        </div>
  
        <button  className="btn btn-sm btn-outline-dark my-4 float-right" onClick={handleShow}>
          <i className="fas fa-plus-circle"></i> New 
        </button>
        {/* modal for add new category */}
        <Modal  show={show} onHide={handleClose}>
          <Modal.Header closeButton>
          </Modal.Header>
          <Modal.Body>
            <AddCategory handleClose={handleClose} />
          </Modal.Body>
        </Modal>

        {/* modal for edit exist category */}
        <Modal  show={showEdit} onHide={handleCloseEdit}>
          <Modal.Header closeButton>
          </Modal.Header>
          <Modal.Body>
            <EditCategory handleCloseEdit={handleCloseEdit} categoryID={categoryID}/>
          </Modal.Body>
        </Modal>

        {categoriesData}
    </div>
  )
}

export default AllCategories
