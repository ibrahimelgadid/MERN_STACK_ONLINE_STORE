import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { editUserRole, getUser } from '../../ReduxCycle/actions/membersActions';

function Role() {
  const [role, setRole] = useState('');
  const {user} = useSelector(state=>state.membersReducer);
  const dispatch = useDispatch();
  const GetUser = bindActionCreators(getUser, dispatch);
  const EditUserRole = bindActionCreators(editUserRole, dispatch)
  const {user_id} = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    GetUser(user_id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  useEffect(() => {
    setRole(user.role)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const handleChangeRole = (e)=>{
    e.preventDefault();
    const roleData = {role}
    EditUserRole(roleData,user_id,navigate)
  }

  return (
    <div className="row justify-content-center my-4">
      <div className="col-10 col-md-8">
        <div class="card">
          <div class="card-header">
            {user.name}
          </div>
          <div class="card-body">
          <form onSubmit={handleChangeRole}>
            <div class="mb-3 input-group">
              <span className='input-group-text'><i className='fas fa-user-tag'></i></span>
              <select class="form-select"  value={role} onChange={(e)=>setRole(e.target.value)}>
                <option >user</option>
                <option >admin</option>
                <option >superAdmin</option>
              </select>
            </div>
            <button className='btn btn-primary col-12' type='submit'>Change</button>
          </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Role
