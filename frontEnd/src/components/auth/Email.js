import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { bindActionCreators } from "redux";
import { sendMailToResetPass } from "../../ReduxCycle/actions/authActions";

function Email() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [Loading, setLoading] = useState(false);

  const [isMounted, setIsMounted] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const SendMailToResetPass = bindActionCreators(sendMailToResetPass, dispatch);
  const errorsFromState = useSelector((state) => state.errorsReducer);
  const { isAuthenticated } = useSelector((state) => state.authReducer);

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const resetData = {
      email,
    };
    SendMailToResetPass(resetData, navigate, setLoading);
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
    <Row className="justify-content-center my-4">
      <Col sm={8} xs={11} md={6}>
        <Card className="shadow">
          <Card.Header className="text-center">
            <p className="text-muted">
              Please insert your email to send you reset code.
            </p>
          </Card.Header>
          <Card.Body>
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
                  className={classNames({ "is-invalid": errors.email })}
                />
                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
              </Form.Group>

              <Button className="col-12" variant="primary" type="submit">
                {Loading?<Spinner animation="border" role="status" />:"Send"}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default Email;
