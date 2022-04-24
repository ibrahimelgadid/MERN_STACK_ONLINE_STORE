import { faEnvelope, faLockOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import { Form, Card, Button, Row, Col } from "react-bootstrap";
import classnames from "classnames";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { login } from "../../ReduxCycle/actions/authActions";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isMounted, setIsMounted] = useState(false);
  const navigate = useNavigate();
  const Login = bindActionCreators(login, useDispatch());
  const { isAuthenticated } = useSelector((state) => state.authReducer);
  const errorsFromState = useSelector((state) => state.errorsReducer);

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const loginData = {
      email,
      password,
    };
    Login(loginData);
  };

  useEffect(() => {
    if (isMounted) {
      setErrors(errorsFromState);
    } else {
      setIsMounted(true);
    }
    // eslint-disable-next-line
  }, [errors, errorsFromState]);

  ///////////////////////////////

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
    // eslint-disable-next-line
  }, [isAuthenticated]);

  return (
    <div>
      <Row className="justify-content-center my-4">
        <Col sm={8} xs={11} md={6}>
          <Card className="shadow">
            <Card.Header className="text-center">
              <h5>
                <Link style={{ textDecoration: "none" }} to={"/register"}>
                  Register{" "}
                </Link>
                | Login
              </h5>
            </Card.Header>
            <Card.Body>
              For superAdmin authority login with{" "}
              <span className="d-block">
                username:- <strong>admin@admin.com</strong>
              </span>
              <span className="d-block">
                password:- <strong>1234</strong>
              </span>
              <Form onSubmit={handleOnSubmit}>
                <Form.Group
                  className="input-group mb-3"
                  controlId="formBasicEmail"
                >
                  <span className="input-group-text">
                    <FontAwesomeIcon icon={faEnvelope} />
                  </span>
                  <Form.Control
                    type="text"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={classnames({ "is-invalid": errors.email })}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  className="input-group mb-3"
                  controlId="formBasicPassword"
                >
                  <span className="input-group-text">
                    <FontAwesomeIcon icon={faLockOpen} />
                  </span>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={classnames({ "is-invalid": errors.password })}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </Form.Group>
                <Button className="col-12" variant="primary" type="submit">
                  Login
                </Button>
                <p className="my-2 text-center">
                  <Link to="/email">Are you forgot your password?</Link>
                </p>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Login;
