module Contexts
  module Availabilities
    class Creation
      def initialize(availability, current_user)
        I18n.locale = :en

        @availability = availability
        @current_user = current_user
        @timezone = current_user[:timezone]

        @day_index = @availability[:day].to_i
        @day = I18n.t('date.day_names')[@day_index]

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
        check_if_less_than_30_minutes?

        check_if_overlaps?

        check_if_starts_before_ends?

        Time.zone = 'UTC'

        new_availability_params = @availability.merge({
                                                          :day => @day,
                                                          :start_time => @parsed_start_time,
                                                          :end_time => @parsed_end_time,
                                                          :user_id => @current_user.id,
                                                      })

        @new_availability = Availability.create!(new_availability_params)
        @new_availability

        unless @new_availability
          message = I18n.t('custom_errors.messages.unknown_error')
          raise Availabilities::Errors::UnknownAvailabilityError, message
        end

        Time.zone = 'UTC'
        @new_availability
      end

      private

      def check_if_overlaps?
        Time.zone = @timezone
        existing_availabilities = @current_user.availabilities.where('day = ?', @day)

        if existing_availabilities.present?
          current_range = @parsed_start_time..@parsed_end_time

          overlaps = existing_availabilities.any? do |availability|
            existing_range = availability[:start_time]..availability[:end_time]

            current_range == existing_range
          end

          if overlaps
            message = I18n.t('custom_errors.messages.overlapping_availability')
            raise Availabilities::Errors::OverlappingAvailability, message
          end
        end
      end

      def check_if_less_than_30_minutes?
        minutes = ((@parsed_end_time.to_time - @parsed_start_time.to_time) / 1.minute).round
        if minutes < 30 && !is_start_time_day_before? && !is_end_time_day_after?
          message = I18n.t('custom_errors.messages.minimum_availability_required')
          raise Availabilities::Errors::ShortAvailability, message
        end
      end

      def check_if_starts_before_ends?
        Time.zone = @timezone

        if @parsed_end_time < @parsed_start_time && !is_start_time_day_before? && !is_end_time_day_after?
          message = I18n.t('custom_errors.messages.end_time_after_start_time')
          raise Availabilities::Errors::ShortAvailability, message
        end
      end

      private

      def day_month(index)
        "#{I18n.t('date.day_names')[@day_index]}, #{index + 1} Jan 2001"
      end

      def parse_time(time)
        t = Time.zone.parse(time)
        Time.zone.parse(t.strftime("#{@day_index + 1} Jan 2001 %R"))
      end

      def initialize_start_time
        @parsed_start_time = parse_time(@availability[:start_time])
        return @parsed_start_time
      end

      def initialize_end_time
        @parsed_end_time = parse_time(@availability[:end_time])
        return @parsed_end_time
      end

      def is_start_time_day_before?
        Time.zone = 'UTC'

        Time.zone.parse(@availability[:start_time]).strftime("%H").to_i - offset <= 0
      end

      def is_end_time_day_after?
        Time.zone = 'UTC'

        Time.zone.parse(@availability[:end_time]).strftime("%H").to_i + offset.abs >= 24
      end

      def offset
        Time.zone = @timezone
        Time.zone.utc_offset / 3600
      end
    end
  end
end
