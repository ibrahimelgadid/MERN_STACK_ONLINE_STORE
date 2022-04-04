const validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function OrdersErrors(data) {
        let errors={};
        data.name = !isEmpty(data.name)?data.name :"";
        data.email = !isEmpty(data.email)?data.email :"";
        data.address = !isEmpty(data.address)?data.address :"";
        data.phone = !isEmpty(data.phone)?data.phone :"";
        

        if(!validator.isLength(data.name,{min:2})){
            errors.name='name value must be at least 2 charchter'
        }

        if(validator.isEmpty(data.name)){
            errors.name='name field is required'
        }

        
        if(!validator.isEmail(data.email)){
            errors.email='Enter valid email'
        }

        if(validator.isEmpty(data.email)){
            errors.email='email field is required'
        }

        if(!validator.isNumeric(data.phone)){
            errors.phone='Enter valid phone'
        }
        
        if(validator.isEmpty(data.phone)){
            errors.phone='phone field is required'
        }


        
        if(validator.isEmpty(data.address)){
            errors.address='address field is required'
        }

        return{
            errors,
            isValid:isEmpty(errors)
        }
    }