const Validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validateCommentInput(data) {
  let errors = {};

  data.comment = !isEmpty(data.comment) ? data.comment : '';

  if (Validator.isEmpty(data.comment)) {
    errors.comment = 'Comment field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
