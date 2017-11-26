module Contexts
  module Availabilities
    class Creation
      def initialize(availability, timezone, current_user)
        @availability = availability
        @timezone = timezone
        @current_user = current_user


        ap @timezone
        @day = @availability[:day]

        unless @availability[:start_time].present? && @timezone.present?
          raise Availabilities::Errors::StartTimeMissing, 'Start time is missing.'
        end

        unless @availability[:end_time].present?  && @timezone.present?
          raise Availabilities::Errors::EndTimeMissing, 'End time is missing.'
        end

        initialize_start_time
        initialize_end_time

      end

      def execute

        check_if_starts_before_ends?

        check_if_less_than_30_minutes?

        check_if_overlaps?

        new_availability_params = @availability.merge({
            :start_time => @utc_start_time,
            :end_time => @utc_end_time,
            :user_id => @current_user.id
        })

        Availability.create!(new_availability_params)

        unless @new_availability
          raise Availabilities::Errors::UnknownAvailabilityError, 'Unknown error happened. Thanks for contacting us.'
        end
        @new_availability
      end

      private

      def check_if_overlaps?
        existing_availabilities = Availability.where('day = ?', @day)

        if existing_availabilities.present?
          range = Range.new @availability['start_time'], @availability['end_time']

          overlaps = existing_availabilities.in_range(range)
           if overlaps.present?
            raise Availabilities::Errors::OverlappingAvailability, 'This would overlap with some of your existing availabilities.
You might want to delete them and try again.'
           end
        end
      end

      def check_if_less_than_30_minutes?
        minutes = ((@local_end_time - @local_start_time) / 1.minute).round
        if minutes < 30
          raise Availabilities::Errors::ShortAvailability, 'The minimum required for a class is 30 minutes.'
        end
      end

      def check_if_starts_before_ends?
        if (@local_end_time - @local_start_time) < 0
          raise Availabilities::Errors::ShortAvailability, 'Please select an end time chronologically after start time.'
        end
      end

      private

      def initialize_start_time
        @local_start_time = Time.parse(@availability[:start_time] + ' ' + @timezone)
        @utc_start_time = @local_start_time.utc.iso8601
      end

      def initialize_end_time
        @local_end_time =  Time.parse(@availability[:end_time] + ' ' + @timezone)
        @utc_end_time = @local_end_time.utc.iso8601
      end
    end
  end
end
