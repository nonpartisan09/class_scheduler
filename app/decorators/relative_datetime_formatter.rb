require 'active_support/concern'

module RelativeDatetimeFormatter
  extend ActiveSupport::Concern

  included do
    def relative_datetime(datetime)
      datetime_string = h.time_ago_in_words(datetime)

      undesired_prefix = 'about '

      if datetime_string.start_with?(undesired_prefix)
        datetime_string[(undesired_prefix.length)..-1]
      else
        datetime_string
      end
    end
  end

  module ClassMethods

  end
end
