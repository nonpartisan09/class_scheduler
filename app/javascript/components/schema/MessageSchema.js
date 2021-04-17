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
  body: Joi.string().required().options({
    language: {
      any: {
        required: 'Please enter a message',
        empty: 'Please enter a message',
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
