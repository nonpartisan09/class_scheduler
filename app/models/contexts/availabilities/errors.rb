module Contexts::Availabilities::Errors
  class UnknownAvailabilityError < RuntimeError

  end

  class StartTimeMissing < RuntimeError

  end

  class EndTimeMissing < RuntimeError

  end

  class OverlappingAvailability < RuntimeError

  end

  class ShortAvailability < RuntimeError

  end

  class DayMissing < RuntimeError

  end

  class CourseMissing < RuntimeError

  end
end
