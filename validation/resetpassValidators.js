const validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function resetPass(data) {
        let errors={};

            data.password = !isEmpty(data.password)?data.password :"";
            data.confirmPassword = !isEmpty(data.confirmPassword)?data.confirmPassword :"";

            
            if(!validator.isLength(data.password,{min:4,max:20})){
                errors.password='password value must be between 2 and 20 charchter'
            }

            if(validator.isEmpty(data.password)){
                errors.password='password field is required'
            }
        
            if(!validator.equals(data.confirmPassword,data.password)){
                errors.confirmPassword='Confirm password doesn\'t match'
            }

            if(validator.isEmpty(data.confirmPassword)){
                errors.confirmPassword='confirmPassword field is required'
            }
        

            return{
                errors,
                isValid:isEmpty(errors)
            }
    }