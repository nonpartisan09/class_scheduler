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

  description: Joi.string().allow('').max(280).options({
    language: {
      string: {
        max: 'Just like a tweet, keep it short (less than 280 characters) and sweet',
      }
    }
  }),

  thumbnail_image: Joi.object().keys({
    image: Joi.object(),
    url: Joi.string()
  }).or('image', 'url').options({
    language: {
      object: {
        missing: 'Must provide a thumbnail'
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
