const validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function categoryErrors(data) {
        let errors={};
        data.name = !isEmpty(data.name)?data.name :"";
        data.description = !isEmpty(data.description)?data.description :"";
        

        if(!validator.isLength(data.name,{min:2})){
            errors.name='name value must be at least 2 charchter'
        }

        if(validator.isEmpty(data.name)){
            errors.name='name field is required'
        }

        if(validator.isEmpty(data.description)){
            errors.description='description field is required'
        }

        return{
            errors,
            isValid:isEmpty(errors)
        }
    }