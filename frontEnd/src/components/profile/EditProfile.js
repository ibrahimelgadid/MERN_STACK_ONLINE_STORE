
import React, { useEffect, useState } from 'react'
import { Form, Card, Button,Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressBook, faEnvelope, faUser } from '@fortawesome/free-solid-svg-icons'
import { faYoutube, faFacebook, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons'

import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { toast } from 'react-toastify';
import isEmpty from "../../utilis/isEmpty";
import { editProfile } from '../../ReduxCycle/actions/authActions';

import { getProfile } from '../../ReduxCycle/actions/authActions';
import {bindActionCreators} from 'redux';
import { useDispatch, useSelector } from "react-redux";


function EditProfile() {

  let [name, setName] = useState('');
  let [email, setEmail] = useState('');
  let [address, setAddress] = useState('');
  let [youtube, setYoutube] = useState('');
  let [facebook, setFacebook] = useState('');
  let [instagram, setInstagram] = useState('');
  let [twitter, setTwitter] = useState('');
  let [errors, setErrors] = useState({});
  let [isMounted, setIsMounted] = useState(false);

  let dispatch = useDispatch()
  let navigate = useNavigate()

  let GetProfile = bindActionCreators(getProfile, dispatch);
  let EditProfile = bindActionCreators(editProfile, dispatch);
  let errorsFromState = useSelector(state=> state.errorsReducer);
  let { user} = useSelector(state=> state.authReducer);




  const handleOnSubmit = (e)=>{
    e.preventDefault();
    let editProfileData = {
      name,email,address,youtube,
      facebook,instagram,twitter
    }
    // console.log(editProfileData);
    EditProfile(editProfileData, navigate)
  }


  useEffect(() => {
    GetProfile();
    // eslint-disable-next-line
  }, []);


  useEffect(() => {
    if (!isEmpty(user)) {
      setName(user.name);
      setEmail(user.email);
      user.social.address = !isEmpty(user.social.address)?setAddress(user.social.address):'';
      user.social.youtube = !isEmpty(user.social.youtube)?setYoutube(user.social.youtube):'';
      user.social.facebook = !isEmpty(user.social.facebook)?setFacebook(user.social.facebook):'';
      user.social.twitter = !isEmpty(user.social.twitter)?setTwitter(user.social.twitter):'';
      user.social.instagram = !isEmpty(user.social.instagram)?setInstagram(user.social.instagram):'';
    }
  }, [user])


  useEffect(() => {
    if(isMounted){

      setErrors(errorsFromState)
      
      if(!isEmpty(errorsFromState)){
        Object.values(errors).map(value=>toast.warn(value, {theme:'colored'}))
      }

    }else{setIsMounted(true)}
    // eslint-disable-next-line
  }, [errors, errorsFromState]);


    return (
      <div>
      <Row className="justify-content-center my-4">
        <Col sm={8} xs={11} md={6}>
          <Card className='shadow'>
            <Card.Header  className="text-center">
              <h5>Edit Profile</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleOnSubmit}>
                <Link to="/profile" className="btn col-12 my-2 btn-dark">
                        Go Back
                </Link>
                  <Form.Group className="input-group mb-3" controlId="formBasicName">
                  <span className="input-group-text"><FontAwesomeIcon  icon={faUser} /></span>
                    <Form.Control 
                      type="text"
                      value={name}
                      className={classNames('', {'is-invalid':errors.name})}
                      onChange={(e)=>setName(e.target.value)}
                      />
                  </Form.Group>

                  <Form.Group className="input-group mb-3" controlId="formBasicEmail">
                  <span className="input-group-text"><FontAwesomeIcon icon={faEnvelope} /></span>                    
                  <Form.Control 
                      type="email" 
                      value={email}
                      className={classNames('', {'is-invalid':errors.email})}
                      onChange={(e)=>setEmail(e.target.value)}
                      />
                  </Form.Group>

                  <Form.Group className="input-group mb-3" controlId="formBasicPassword">
                  <span className="input-group-text"><FontAwesomeIcon icon={faAddressBook} /></span>                    
                  <Form.Control
                      type="text"
                      placeholder='Enter your address (optional)'
                      value={address}
                      className={classNames('', {'is-invalid':errors.address})}
                      onChange={(e)=>setAddress(e.target.value)}
                      />
                  </Form.Group>

                  <Form.Group className="input-group mb-3" controlId="formBasicConfirm">
                  <span className="input-group-text"><FontAwesomeIcon icon={faYoutube} /></span>                    
                  <Form.Control 
                      type="text" 
                      placeholder="Enter your youtube URL (optional)" 
                      value={youtube}
                      className={classNames('', {'is-invalid':errors.youtube})}
                      onChange={(e)=>setYoutube(e.target.value)}
                      />
                  </Form.Group>

                  <Form.Group className="input-group mb-3" controlId="formBasicConfirm">
                  <span className="input-group-text"><FontAwesomeIcon icon={faFacebook} /></span>                    
                  <Form.Control 
                      type="text" 
                      placeholder="Enter your facebook URL (optional)" 
                      value={facebook}
                      className={classNames('', {'is-invalid':errors.facebook})}
                      onChange={(e)=>setFacebook(e.target.value)}
                      />
                  </Form.Group>

                  <Form.Group className="input-group mb-3" controlId="formBasicConfirm">
                  <span className="input-group-text"><FontAwesomeIcon icon={faTwitter} /></span>                    
                  <Form.Control 
                      type="text" 
                      placeholder="Enter your twitter URL (optional)" 
                      value={twitter}
                      className={classNames('', {'is-invalid':errors.twitter})}
                      onChange={(e)=>setTwitter(e.target.value)}
                      />
                  </Form.Group>

                  <Form.Group className="input-group mb-3" controlId="formBasicConfirm">
                  <span className="input-group-text"><FontAwesomeIcon icon={faInstagram} /></span>                    
                  <Form.Control 
                      type="text" 
                      placeholder="Enter your instagram URL (optional)" 
                      value={instagram}
                      className={classNames('', {'is-invalid':errors.instagram})}
                      onChange={(e)=>setInstagram(e.target.value)}
                      />
                  </Form.Group>

                  <Button className='col-12' variant="primary" type="submit">
                  Edit Profile
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default EditProfile