import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { editUserRole, getUser } from '../../ReduxCycle/actions/membersActions';

function Role() {
  let [role, setRole] = useState('');
  let {user} = useSelector(state=>state.membersReducer);
  let dispatch = useDispatch();
  let GetUser = bindActionCreators(getUser, dispatch);
  let EditUserRole = bindActionCreators(editUserRole, dispatch)
  let {user_id} = useParams();
  let navigate = useNavigate();

  useEffect(() => {
    GetUser(user_id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  useEffect(() => {
    setRole(user.role)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  let handleChangeRole = (e)=>{
    e.preventDefault();
    let roleData = {role}
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
