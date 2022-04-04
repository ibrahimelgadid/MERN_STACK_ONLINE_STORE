import { faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Form, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { resetPass } from '../../ReduxCycle/actions/authActions'

function Email() {

  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isMounted, setIsMounted] = useState(false);
  const navigate = useNavigate()
  const {email, token} = useParams();

  console.log(email, token);

  const ResetPass = bindActionCreators(resetPass, useDispatch());
  const errorsFromState = useSelector(state=> state.errorsReducer);
  const {isAuthenticated} = useSelector(state=> state.authReducer);




  const handleOnSubmit = (e)=>{
    e.preventDefault();
    let resetPassword = {
      password,confirmPassword
    }
    ResetPass(resetPassword, navigate,token, email)
  }
  
  useEffect(() => {
    if(isMounted){

      setErrors(errorsFromState)

    }else{setIsMounted(true)}
    // eslint-disable-next-line
  }, [errors, errorsFromState]);

  useEffect(() => {
    if(isAuthenticated){
      navigate('/')
    }
    // eslint-disable-next-line
  }, [isAuthenticated])
  
  return (
    <Row className="justify-content-center my-4">
    <Col sm={8} xs={11} md={6}>
      <Card className='shadow'>
        
        <Card.Body>
          <Form onSubmit={handleOnSubmit}>

              <Form.Group className="input-group mb-3" controlId="formBasicEmail">
              <span className="input-group-text"><FontAwesomeIcon icon={faLock} /></span>                    
              <Form.Control 
                type="password" 
                placeholder="Enter new password" 
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                className={classNames({'is-invalid':errors.password})}
                
              />
              <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>

              </Form.Group>

              <Form.Group className="input-group mb-3" controlId="formBasicEmail">
              <span className="input-group-text"><FontAwesomeIcon icon={faLockOpen} /></span>                    
              <Form.Control 
                type="password" 
                placeholder="Confirm your password" 
                value={confirmPassword}
                onChange={(e)=>setConfirmPassword(e.target.value)}
                className={classNames({'is-invalid':errors.confirmPassword})}
              />
              <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
              </Form.Group>
              
              <Button className='col-12' variant="primary" type="submit">
                Reset
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Col>
  </Row>
  )
}

export default Email
