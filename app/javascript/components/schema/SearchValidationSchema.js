import Joi from 'joi-browser';
import Availability from '../utils/Availability';

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
  language: Joi.array().min(1).required().options({
    language: {
      array: {
        min: 'Please select at least one language'
      }
    }
  }),
  distance: Joi.number(),
  start_time: Joi.object({
    hour: Joi.string().required().regex(Availability.getHourPattern()).options({
      language: {
        string: {
          regex: {
            base:'NewAvailability.startTimeBlank',
          }
        }
      }
    }),
    minute: Joi.string().required().regex(Availability.getMinutePattern()).options({
      language: {
        string: {
          regex: {
            base:'NewAvailability.startTimeBlank',
          }
        }
      }
    }),      
  }),
  end_time: Joi.object({
    hour: Joi.string().required().regex(Availability.getHourPattern()).options({
      language: {
        string: {
          regex: {
            base:'NewAvailability.endTimeBlank',
          }
        }
      }
    }),
    minute: Joi.string().required().regex(Availability.getMinutePattern()).options({
      language: {
        string: {
          regex: {
            base:'NewAvailability.endTimeBlank',
          }
        }
      }
    }),
  }),  
};

export default SearchValidationSchema;
