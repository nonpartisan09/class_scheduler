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

        unless @availability[:end_time].present? && @timezone.present?
          message = I18n.t('custom_errors.messages.missing_end_time')
          raise Availabilities::Errors::EndTimeMissing, message
        end

        use_account_timezone(availability[:start_time], availability[:end_time])

        parse_times_utc
        parse_times_user_tz
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
          start_time: @parsed_user_start_time.strftime('%H:%M'),
          end_time: @parsed_user_end_time.strftime('%H:%M')
        }
        overlaps = existing_availabilities.any? do |availability|
          # db time is UTC and may span day.
          # But in user local time, it won't span day
          # so keeping it simple and going back to user local time.
          start_time = availability[:start_time]
                       .in_time_zone(@timezone).strftime('%H:%M')
          end_time = availability[:end_time]
                     .in_time_zone(@timezone).strftime('%H:%M')
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
        minutes = (@parsed_user_end_time - @parsed_user_start_time) / 60
        if minutes < 30
          message = I18n.t('custom_errors.messages.minimum_availability_required')
          raise Availabilities::Errors::ShortAvailability, message
        end
      end

      def check_if_starts_before_ends?
        # availabilities can't span user's day so just compare originals
        if @parsed_user_end_time < @parsed_user_start_time
          message = I18n.t('custom_errors.messages.end_time_after_start_time')
          raise Availabilities::Errors::ShortAvailability, message
        end
      end

      def day_month(index)
        "#{I18n.t('date.day_names')[@day_index]}, #{index + 1} Jan 2001"
      end

      def use_account_timezone (start_time, end_time)
        @availability[:start_time] = parse_account_timezone(start_time)
        @availability[:end_time] = parse_account_timezone(end_time)
      end

      def parse_account_timezone(time)
        account_offset = Time.now.in_time_zone(@timezone).formatted_offset
        parsed_time = Time.parse(time)
        datetime_without_timezone = parsed_time.strftime("%Y-%m-%d %H:%M:%S ")
    
        with_account_timezone = datetime_without_timezone + account_offset
      end 

      def parse_time(time)
        t = Time.zone.parse(time)
        Time.zone.parse(t.strftime("#{@day_index + 1} Jan 2001 %R"))
      end

      def parse_times_utc
        Time.zone = 'UTC'
        @parsed_start_time_utc = parse_time(@availability[:start_time])
        @parsed_end_time_utc = end_date_time_utc(@parsed_start_time_utc, parse_time(@availability[:end_time]))
      end

      def end_date_time_utc(start_time, end_time)
        # Use the difference in time between the start and end to find the correct end day
        # when the end time in utc spans to the next day
        start_hour_min = Time.parse(@availability[:start_time]).change(sec: 0)
        end_hour_min = Time.parse(@availability[:end_time]).change(sec: 0)
        duration = (end_hour_min - start_hour_min) / 1.seconds
        actual_end_day = start_time + duration.seconds
      end

      def parse_times_user_tz
        @parsed_user_start_time =
          Time.zone.parse(@availability[:start_time]).change(sec: 0).in_time_zone(@timezone)
        @parsed_user_end_time =
          Time.zone.parse(@availability[:end_time]).change(sec: 0).in_time_zone(@timezone)
      end
    end
  end
end
