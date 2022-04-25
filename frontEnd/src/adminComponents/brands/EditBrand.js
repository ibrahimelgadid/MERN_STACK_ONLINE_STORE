import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { bindActionCreators } from "redux";
import isEmpty from "../../utilis/isEmpty";
import classnames from "classnames";
import { editBrand, getBrand } from "../../ReduxCycle/actions/brandsActions";

function EditBrand({ handleCloseEdit, brandID }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState("");
  let [isMounted, setIsMounted] = useState(false);
  const [Loading, setLoading] = useState(false);

  let errorsFromState = useSelector((state) => state.errorsReducer);
  let { brand } = useSelector((state) => state.brandsReducer);
  const dispatch = useDispatch();
  let EditBrand = bindActionCreators(editBrand, dispatch);
  let GetBrand = bindActionCreators(getBrand, dispatch);

  const handleSumit = (e) => {
    e.preventDefault();
    let brandData = {
      name,
      description,
    };

    EditBrand(brandData, brandID, setLoading);
    handleCloseEdit(true);
  };

  useEffect(() => {
    GetBrand(brandID);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isEmpty(brand)) {
      setName(brand.name);
      setDescription(brand.description);
    }
  }, [brand]);

  useEffect(() => {
    if (isMounted) {
      setErrors(errorsFromState);

      if (!isEmpty(errorsFromState)) {
        Object.values(errors).map((value) =>
          toast.warn(value, { theme: "colored" })
        );
      }
    } else {
      setIsMounted(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errors, errorsFromState]);

  return (
    <div>
      <Row className="justify-content-center ">
        <Col xs={11}>
          <Card className="shadow">
            <Card.Header className="text-center">
              <h5>
                Edit <span className="text-info">{brand.name}</span> Brand
              </h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSumit}>
                <Form.Group className="input-group mb-3">
                  <span className="input-group-text">Name</span>
                  <Form.Control
                    type="text"
                    placeholder="Enter product name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={classnames({ "is-invalid": errors.name })}
                  />
                </Form.Group>

                <Form.Group
                  className="input-group mb-3"
                  controlId="formBasicPassword"
                >
                  <span className="input-group-text">Description</span>
                  <Form.Control
                    type="number"
                    placeholder="Enter product description"
                    as="textarea"
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={classnames({ "is-invalid": errors.description })}
                  />
                </Form.Group>

                <Button className="col-12" variant="primary" type="submit">
                  <i className="fas fa-save"></i>{" "}
                  {Loading ? (
                    <Spinner animation="border" role="status" />
                  ) : (
                    "Save"
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default EditBrand;
