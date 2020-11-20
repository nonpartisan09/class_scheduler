module Contexts
  module Availabilities
    class Creation
      def initialize(availability, current_user)
        I18n.locale = :en

        @current_user = current_user
        @timezone = current_user[:timezone]

        unless availability[:day].present? && @timezone.present?
          message = I18n.t('custom_errors.messages.missing_day')
          raise Availabilities::Errors::DayMissing, message
        end

        unless availability[:start_time].present? && @timezone.present?
          message = I18n.t('custom_errors.messages.missing_start_time')
          raise Availabilities::Errors::StartTimeMissing, message
        end

        unless validTime(availability[:start_time])
          message = I18n.t('custom_errors.messages.wrong_format_start_time')
          raise Availabilities::Errors::StartTimeWrongFormat, message
        end

        unless availability[:end_time].present? && @timezone.present?
          message = I18n.t('custom_errors.messages.missing_end_time')
          raise Availabilities::Errors::EndTimeMissing, message
        end

        unless validTime(availability[:end_time])
          message = I18n.t('custom_errors.messages.wrong_format_end_time')
          raise Availabilities::Errors::EndTimeWrongFormat, message
        end

        @day_index = availability[:day].to_i
        @day = I18n.t('date.day_names')[@day_index]

        @availability = generate_user_datetimes(availability)

        parse_times_utc
      end

      def validTime(time_parameter)
        #accepted format: HH:MM
        if time_parameter.match(/\A[0-2][0-9]:[0-5][0-9]\Z/)
          values = time_parameter.split(":").map(&:to_i)
          isValidTime(values[0], values[1])
        end
      end

      def isValidTime(hour, minute)
        hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59
      end

      def execute
        check_if_starts_before_ends?
        check_if_less_than_30_minutes?
        check_if_overlaps?

        new_availability_params = @availability.merge(
          day: @day,
          start_time: @parsed_start_time_utc,
          end_time: @parsed_end_time_utc,
          user_id: @current_user.id
        )
        @new_availability = Availability.find_or_create_by!(new_availability_params)

        unless @new_availability
          message = I18n.t('custom_errors.messages.unknown_error')
          raise Availabilities::Errors::UnknownAvailabilityError, message
        end

        @new_availability
      end

      private

      def check_if_overlaps?
        existing_availabilities = @current_user.availabilities.where('day = ?', @day)
        return unless existing_availabilities.present?

        # Just compare hours and minutes
        current_range = {
          start_time: @availability[:start_time].strftime('%H:%M'),
          end_time: @availability[:end_time].strftime('%H:%M')
        }
        overlaps = existing_availabilities.any? do |availability|
          # db time is UTC and may span day.
          # But in user local time, it won't span day
          # so keeping it simple and going back to user local time.
          start_time = parse_time_user_offset(availability[:start_time]).strftime('%H:%M')
          end_time = parse_time_user_offset(availability[:end_time]).strftime('%H:%M')

          same = (current_range[:start_time] == start_time) &&
                 (current_range[:end_time] == end_time)
          overlap = (current_range[:start_time] < end_time) &&
                    (current_range[:end_time] > start_time)
          same || overlap
        end

        if overlaps
          message = I18n.t('custom_errors.messages.overlapping_availability')
          raise Availabilities::Errors::OverlappingAvailability, message
        end
      end

      def check_if_less_than_30_minutes?
        # availabilities can't span user's day so just compare originals
        minutes = (@availability[:end_time] - @availability[:start_time]) / 60
        if minutes < 30 && !is_last_availability_slot
          message = I18n.t('custom_errors.messages.minimum_availability_required')
          raise Availabilities::Errors::ShortAvailability, message
        end
      end

      def is_last_availability_slot
        time_format = "%H:%M"
        last_end_time = "23:59"
        last_start_time = "23:30"
  
        is_last_start_slot = @availability[:start_time].strftime(time_format) == last_start_time
        is_last_end_slot = @availability[:end_time].strftime(time_format) == last_end_time

        is_last_start_slot && is_last_end_slot
      end

      def check_if_starts_before_ends?
        # availabilities can't span user's day so just compare originals
        if @availability[:end_time] < @availability[:start_time]
          message = I18n.t('custom_errors.messages.end_time_after_start_time')
          raise Availabilities::Errors::ShortAvailability, message
        end
      end

      def day_month(index)
        "#{I18n.t('date.day_names')[@day_index]}, #{index + 1} Jan 2001"
      end

      def parse_time_user_offset(time) 
        Time.zone = @timezone  
        current_time = Time.zone.now 
        offset = current_time.utc_offset/3600
         
        user_time = ActiveSupport::TimeZone[offset].parse(time.to_s)
      end

      def generate_user_datetimes(availabilities) 
        Time.zone = @timezone
        t = Time.now
        start_datetime = Time.parse(t.strftime("%Y-%m-%d #{availabilities[:start_time]} %Z"))
        end_datetime = Time.parse(t.strftime("%Y-%m-%d #{availabilities[:end_time]} %Z"))

        Hash[{
          day: availabilities[:day],
          start_time: start_datetime,
          end_time: end_datetime,
        }]
      end

      def parse_time(time)
        Time.zone = @timezone
        Time.zone.parse(time.strftime("#{@day_index + 1} Jan 2001 %R"))
      end

      def parse_times_utc
        Time.zone = 'UTC'
        @parsed_start_time_utc = parse_time(@availability[:start_time])
        @parsed_end_time_utc = end_date_time_utc(@parsed_start_time_utc, parse_time(@availability[:end_time]))
      end

      def end_date_time_utc(start_time, end_time)
        # Use the difference in time between the start and end to find the correct end day
        # when the end time in utc spans to the next day
        start_hour_min = @availability[:start_time].change(sec: 0)
        end_hour_min = @availability[:end_time].change(sec: 0)
        duration = (end_hour_min - start_hour_min) / 1.seconds
        actual_end_day = start_time + duration.seconds
      end

    end
  end
end
