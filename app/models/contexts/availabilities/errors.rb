module Contexts::Availabilities::Errors
  class UnknownAvailabilityError < RuntimeError

  end

  class OverlappingAvailability < RuntimeError

  end

  class ShortAvailability < RuntimeError

  end
end
