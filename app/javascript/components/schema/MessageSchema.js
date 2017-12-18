import Joi from 'joi-browser';

const MessageSchema = {
  subject: Joi.string().required().options({
    language: {
      any: {
        required: 'Please enter a subject',
        empty: 'Please enter a subject',
      }
    }
  }),
  body: Joi.string().allow('').max(248).options({
    language: {
      string: {
        max: 'Please keep your message under 248 characters'
      }
    }
  }),
  recipients: Joi.array().min(1).options({
    language: {
      array: {
        min: 'Please select at least one recipient'
      }
    }
  })
};

export default MessageSchema;
