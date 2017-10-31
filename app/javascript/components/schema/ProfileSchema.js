import Joi from 'joi-browser';

const ProfileSchema = {
  courses: Joi.array().min(1).options({
    language: {
      array: {
        min: 'Please select at least one class'
      }
    }
  }),

  first_name: Joi.string().required().options({
    language: {
      any: {
        required: 'Please enter your first name',
        empty: 'Please enter your first name',
      }
    }
  }),

  address: Joi.string().allow(''),
  city: Joi.string().allow(''),
  email: Joi.string().email({ minDomainAtoms: 2 }).required().options({
    language: {
      any: {
        required: 'Please enter an email'
      },
      string: {
        email: 'Please enter a valid email',
      }
    }
  }),
  current_password: Joi.string().min(8),
  password: Joi.string().min(8).allow(''),
  password_confirmation: Joi.any().valid(Joi.ref('password')).options({
    language: {
      any: {
        allowOnly: 'Passwords don\'t match'
      }
    }
  })
};

export default ProfileSchema;
