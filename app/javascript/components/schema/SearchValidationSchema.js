import Joi from 'joi-browser';

const SearchValidationSchema = {
  day: Joi.array().min(1).required().options({
    language: {
      array: {
        min: 'Please select at least one day'
      }
    }
  }),
  program: Joi.array().min(1).required().options({
    language: {
      array: {
        min: 'Please select at least one program'
      }
    }
  }),
  distance: Joi.number(),

  start_time: Joi.date().timestamp().options({
    language: {
      any: {
        allowOnly: 'Please select a start time'
      }
    }
  }),
  end_time: Joi.date().timestamp().options({
    language: {
      any: {
        allowOnly: 'Please enter an end time'
      }
    }
  })
};

export default SearchValidationSchema;
