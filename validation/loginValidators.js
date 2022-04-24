const validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateLoginInputs(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (!validator.isEmail(data.email)) {
    errors.email = "Insert valid email";
  }
  if (validator.isEmpty(data.email)) {
    errors.email = "email field is required";
  }
  if (validator.isEmpty(data.password)) {
    errors.password = "password field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
