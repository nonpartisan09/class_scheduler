import Joi from 'joi-browser';

const ProfileSchema = {
  timezone: Joi.string().required().options({
    language: {
      any: {
        empty: 'Please select a timezone',
      }
    }
  }),
  email_notification: Joi.bool(),
  locale: Joi.string(),
  programs: Joi.array().min(1).options({
    language: {
      array: {
        min: 'Please select at least one program'
      }
    }
  }),

  languages: Joi.array(),

  first_name: Joi.string().required().regex(/^[ a-zA-Z\u00C0-\u017F]+$/).options({
    language: {
      any: {
        required: 'Please enter your first name',
        empty: 'Please enter your first name',
      },
      string: {
        regex: {
          base: 'Please enter a first name without invalid characters',
          name: 'Please enter a first name without invalid characters',
        }
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

  thumbnail_image: Joi.alternatives().try(Joi.object(), Joi.string()),

  address: Joi.string().allow(''),
  city: Joi.string().allow(''),
  state: Joi.string().allow(''),
  country: Joi.string().allow(''),

  email: Joi.string().email().required().options({
    language: {
      any: {
        required: 'Please enter an email'
      },
      string: {
        email: 'Please enter a valid email',
      }
    }
  }),
  current_password: Joi.string().min(8).allow(''),
  password: Joi.string().min(8).allow(''),
  password_confirmation: Joi.any().valid(Joi.ref('password')).options({
    language: {
      any: {
        allowOnly: 'Passwords don\'t match'
      }
    }
  }),
  client: Joi.bool(),
  contact_permission: Joi.bool(),
  terms_and_conditions: Joi.bool(),
  volunteer: Joi.bool()
};

export default ProfileSchema;
