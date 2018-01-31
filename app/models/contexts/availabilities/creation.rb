module Contexts
  module Availabilities
    class Creation
      def initialize(availability, current_user)
        I18n.locale = :en

        @availability = availability
        @timezone = current_user[:timezone]
        @current_user = current_user
        day_index = @availability[:day].to_i
        @day = I18n.t('date.day_names')[day_index]

        unless @availability[:start_time].present? && @timezone.present?
          message = I18n.t('custom_errors.messages.missing_start_time')
          raise Availabilities::Errors::StartTimeMissing, message
        end

        unless @availability[:end_time].present?  && @timezone.present?
          message = I18n.t('custom_errors.messages.missing_end_time')
          raise Availabilities::Errors::EndTimeMissing, message
        end

        initialize_start_time
        initialize_end_time

      end

      def execute

        check_if_starts_before_ends?

        check_if_less_than_30_minutes?

        check_if_overlaps?

        new_availability_params = @availability.merge({
            :day => @day,
            :start_time => @utc_start_time,
            :end_time => @utc_end_time,
            :user_id => @current_user.id,
        })

        Availability.create!(new_availability_params)

        unless @new_availability
          message = I18n.t('custom_errors.messages.unknown_error')
          raise Availabilities::Errors::UnknownAvailabilityError, message
        end
        @new_availability
      end

      private

      def check_if_overlaps?
        existing_availabilities = Availability.where('day = ?', @day)

        if existing_availabilities.present?
          range = Range.new @utc_start_time, @utc_end_time

          overlaps = existing_availabilities.in_range(range)
           if overlaps.present?
             message = I18n.t('custom_errors.messages.overlapping_availability')
            raise Availabilities::Errors::OverlappingAvailability, message
           end
        end
      end

      def check_if_less_than_30_minutes?
        minutes = ((@parsed_end_time - @parsed_start_time) / 1.minute).round
        if minutes < 30
          message = I18n.t('custom_errors.messages.minimum_availability_required')
          raise Availabilities::Errors::ShortAvailability, message
        end
      end

      def check_if_starts_before_ends?
        if (@parsed_end_time - @parsed_start_time) < 0
          message = I18n.t('custom_errors.messages.end_time_after_start_time')
          raise Availabilities::Errors::ShortAvailability, message
        end
      end

      private

      def initialize_start_time
        @parsed_start_time = Time.parse(@availability[:start_time])
        Time.zone = @timezone
        @utc_start_time = Time.zone.local_to_utc(@parsed_start_time)
      end

      def initialize_end_time
        @parsed_end_time =  Time.parse(@availability[:end_time])
        Time.zone = @timezone
        @utc_end_time = Time.zone.local_to_utc(@parsed_end_time)
      end
    end
  end
end
