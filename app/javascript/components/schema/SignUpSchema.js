import Joi from 'joi-browser';

const SignUpSchema = {
  role: Joi.string(),
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
  password: Joi.string().min(8).required(),
  password_confirmation: Joi.any().valid(Joi.ref('password')).required().options({
    language: {
      any: {
        allowOnly: 'Passwords don\'t match'
      }
    }
  }),
  contact_permission: Joi.boolean(),

  terms_and_conditions: Joi.boolean().valid(true).options({
    language: {
      any: {
        allowOnly: 'Please agree to our terms and conditions'
      }
    }
  })
};

export default SignUpSchema;
