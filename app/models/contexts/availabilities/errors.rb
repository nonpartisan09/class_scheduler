module Contexts::Availabilities::Errors
  class UnknownAvailabilityError < RuntimeError

  end

  class StartTimeMissing < RuntimeError

  end

  class StartTimeWrongFormat < RuntimeError
  
  end

  class EndTimeMissing < RuntimeError

  end

  class EndTimeWrongFormat < RuntimeError

  end

  class OverlappingAvailability < RuntimeError

  end

  class ShortAvailability < RuntimeError

  end

  class DayMissing < RuntimeError

  end

  class ProgramMissing < RuntimeError

  end

  class LanguageMissing < RuntimeError

  end

  class IncorrectOrder < RuntimeError

  end
end
