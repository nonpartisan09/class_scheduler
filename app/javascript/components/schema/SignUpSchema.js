import Joi from 'joi-browser';

const SignUpSchema = {
  timezone: Joi.string().required().options({
    language: {
      any: {
        empty: 'Please select a timezone',
      }
    }
  }),
  email_notification: Joi.bool(),
  role: Joi.string(),
  locale: Joi.string(),
  programs: Joi.array().min(1).options({
    language: {
      array: {
        min: 'Please select at least one program'
      }
    }
  }),

  languages: Joi.array().min(1).options({
    language: {
      array: {
        min: 'Please select at least one language'
      }
    }
  }),

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

  last_name: Joi.string().required().regex(/^[ a-zA-Z\u00C0-\u017F]+$/).options({
    language: {
      any: {
        required: 'Please enter your last name',
        empty: 'Please enter your last name',
      },
      string: {
        regex: {
          base: 'Please enter a last name without invalid characters',
          name: 'Please enter a last name without invalid characters',
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
  country: Joi.string().required().options({
    language: {
      any: {
        empty: 'Please select a country'
      },
    }
  }),

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
  phone_number: Joi.string().required(),
  password: Joi.string().min(8).max(30).required(),
  password_confirmation: Joi.any().valid(Joi.ref('password')).required().options({
    language: {
      any: {
        allowOnly: 'Passwords don\'t match'
      }
    }
  }),
  contact_permission: Joi.boolean(),
  how_they_found_us: Joi.string().required().options({
    language: {
      any: {
        empty: 'Please select an option for how you found us'
      },
    }
  }),

  terms_and_conditions: Joi.boolean().valid(true).options({
    language: {
      any: {
        allowOnly: 'Please agree to our terms of use'
      }
    }
  }),
  privacy_policy: Joi.boolean().valid(true).options({
    language: {
      any: {
        allowOnly: 'Please agree to our privacy policy'
      }
    }
  }),
  current_password: Joi.string().min(8).allow('')
};

export default SignUpSchema;
