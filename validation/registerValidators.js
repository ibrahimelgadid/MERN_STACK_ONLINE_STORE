const validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateRegisterInputs(data) {
  let errors = {};
  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.confirmPassword = !isEmpty(data.confirmPassword)
    ? data.confirmPassword
    : "";
  data.avatar = !isEmpty(data.avatar) ? data.avatar : "";

  if (!validator.isLength(data.name, { min: 2, max: 20 })) {
    errors.name = "name value must be between 2 and 20 charchter";
  }
  if (validator.isEmpty(data.name)) {
    errors.name = "name field is required";
  }

  if (!validator.isEmail(data.email)) {
    errors.email = "Insert valid email";
  }
  if (validator.isEmpty(data.email)) {
    errors.email = "email field is required";
  }

  if (!validator.isLength(data.password, { min: 4, max: 20 })) {
    errors.password = "password value must be between 2 and 20 charchter";
  }

  if (validator.isEmpty(data.password)) {
    errors.password = "password field is required";
  }

  if (!validator.equals(data.confirmPassword, data.password)) {
    errors.confirmPassword = "Confirm password doesn't match";
  }

  if (validator.isEmpty(data.confirmPassword)) {
    errors.confirmPassword = "confirmPassword field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
