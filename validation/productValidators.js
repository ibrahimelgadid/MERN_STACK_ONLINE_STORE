const validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateProductInputs(data) {
  let errors = {};
  data.name = !isEmpty(data.name) ? data.name : "";
  data.price = !isEmpty(data.price) ? data.price : "";
  data.category = !isEmpty(data.category) ? data.category : "";
  data.brand = !isEmpty(data.brand) ? data.brand : "";

  if (!validator.isLength(data.name, { min: 2 })) {
    errors.name = "name value must be at least 2 charchters";
  }
  if (validator.isEmpty(data.name)) {
    errors.name = "name field is required";
  }

  if (!validator.isNumeric(data.price)) {
    errors.price = "Insert number";
  }
  if (validator.isEmpty(data.price)) {
    errors.price = "price field is required";
  }

  if (validator.isEmpty(data.category)) {
    errors.category = "category field is required";
  }

  if (validator.isEmpty(data.brand)) {
    errors.brand = "brand field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
