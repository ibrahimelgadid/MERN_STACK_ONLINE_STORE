const Validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validateUserInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  // data.address = !isEmpty(data.address) ? data.address : '';

  if (!Validator.isLength(data.name, { min: 2, max: 40 })) {
    errors.name = 'name needs to between 2 and 4 characters';
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = 'User name is required';
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = 'email field is required';
  }

  if(!isEmpty(data.address)){
    if (!Validator.isLength(data.address, { min: 2, max: 40 })) {
      errors.address = 'address needs to between 2 and 4 characters';
    }
  }


  if (!isEmpty(data.youtube)) {
    if (!Validator.isURL(data.youtube)) {
      errors.youtube = 'Not a valid URL';
    }
  }

  if (!isEmpty(data.twitter)) {
    if (!Validator.isURL(data.twitter)) {
      errors.twitter = 'Not a valid URL';
    }
  }

  if (!isEmpty(data.facebook)) {
    if (!Validator.isURL(data.facebook)) {
      errors.facebook = 'Not a valid URL';
    }
  }

  if (!isEmpty(data.instagram)) {
    if (!Validator.isURL(data.instagram)) {
      errors.instagram = 'Not a valid URL';
    }
  }

  return{
    errors,
    isValid:isEmpty(errors)
  };
};
