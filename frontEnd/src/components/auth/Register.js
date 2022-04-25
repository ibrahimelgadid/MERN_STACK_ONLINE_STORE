import React, { useEffect, useState } from "react";
import { Form, Card, Button, Row, Col, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faLockOpen,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import classNames from "classnames";
import { register } from "../../ReduxCycle/actions/authActions";
import { bindActionCreators } from "redux";
import { useDispatch, useSelector } from "react-redux";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isMounted, setIsMounted] = useState(false);
  const [Loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const Register = bindActionCreators(register, useDispatch());
  const errorsFromState = useSelector((state) => state.errorsReducer);
  const { isAuthenticated } = useSelector((state) => state.authReducer);

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const registerData = {
      name,
      email,
      password,
      confirmPassword,
    };
    Register(registerData, navigate, setLoading);
  };

  useEffect(() => {
    if (isMounted) {
      setErrors(errorsFromState);
    } else {
      setIsMounted(true);
    }
    // eslint-disable-next-line
  }, [errors, errorsFromState]);

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
                Register |
                <Link to={"/login"} style={{ textDecoration: "none" }}>
                  {" "}
                  Login
                </Link>
              </h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleOnSubmit}>
                <Form.Group
                  className="input-group mb-3"
                  controlId="formBasicName"
                >
                  <span className="input-group-text">
                    <FontAwesomeIcon icon={faUser} />
                  </span>
                  <Form.Control
                    type="text"
                    placeholder="Enter name"
                    value={name}
                    className={classNames("", { "is-invalid": errors.name })}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group
                  className="input-group mb-3"
                  controlId="formBasicEmail"
                >
                  <span className="input-group-text">
                    <FontAwesomeIcon icon={faEnvelope} />
                  </span>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    className={classNames("", { "is-invalid": errors.email })}
                    onChange={(e) => setEmail(e.target.value)}
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
                    <FontAwesomeIcon icon={faLock} />
                  </span>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    className={classNames("", {
                      "is-invalid": errors.password,
                    })}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group
                  className="input-group mb-3"
                  controlId="formBasicConfirm"
                >
                  <span className="input-group-text">
                    <FontAwesomeIcon icon={faLockOpen} />
                  </span>
                  <Form.Control
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    className={classNames("", {
                      "is-invalid": errors.confirmPassword,
                    })}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.confirmPassword}
                  </Form.Control.Feedback>
                </Form.Group>
                <Button className="col-12" variant="primary" type="submit">
                  {Loading ? (
                    <Spinner animation="border" role="status" />
                  ) : (
                    "Register"
                  )}
                </Button>
                <p className="my-2 text-center">
                  <Link to="/login">Are you already have account?</Link>
                </p>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Register;
