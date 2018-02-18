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

        create_availability

        @new_availabilities
      end

      private

      def create_availability
        @new_availabilities = []

        if !is_start_time_day_before? && !is_end_time_day_after?
          Time.zone = 'UTC'

          new_availability_params = @availability.merge({
              :day => @day,
              :start_time => @parsed_start_time,
              :end_time => @parsed_end_time,
              :user_id => @current_user.id,
          })

          new_availability = Availability.create!(new_availability_params)
          @new_availabilities << new_availability

        elsif is_start_time_day_before?
          day_one = @availability[:day].to_i == 0? 6 : @availability[:day].to_i - 1
          start_time = @availability[:start_time].chars.last(23).first(6).join('')
          end_time = @availability[:end_time].chars.last(23).first(6).join('')

          Time.zone = @timezone

          parsed_start_time_one = Time.zone.parse("#{day_month(day_one)} #{start_time} #{Time.zone.tzinfo}")
          parsed_end_time_two = Time.zone.parse("#{day_month(@day_index)} #{end_time} #{Time.zone.tzinfo}")

          Time.zone = 'UTC'
          parsed_end_time_one = Time.zone.utc_to_local(Time.parse("#{day_month(day_one)} 23:59 #{Time.zone.tzinfo}"))
          parsed_start_time_two = Time.zone.utc_to_local(Time.parse("#{day_month(@day_index)} 00:00 #{Time.zone.tzinfo}"))

          availability_one = @availability.merge({
              :day => @day,
              :start_time => parsed_start_time_one,
              :end_time => parsed_end_time_one,
              :user_id => @current_user.id,
          })

          availability_two = @availability.merge({
              :day => @day,
              :start_time => parsed_start_time_two,
              :end_time => parsed_end_time_two,
              :user_id => @current_user.id,
          })

          availability_one = Availability.create(availability_one)
          availability_two = Availability.create(availability_two)

          @new_availabilities << availability_one
          @new_availabilities << availability_two

        elsif is_end_time_day_after?
          day_two = @availability[:day].to_i == 6?  0 : @availability[:day].to_i + 1
          Time.zone = @timezone

          start_time = @availability[:start_time].chars.last(23).first(6).join('')
          end_time = @availability[:end_time].chars.last(23).first(6).join('')


          parsed_start_time_one = Time.zone.parse("#{day_month(@day_index)} #{start_time}")
          parsed_end_time_two = Time.zone.parse("#{day_month(day_two)} #{end_time}")

          parsed_end_time_one = Time.zone.utc_to_local(Time.parse("#{day_month(@day_index)} 23:59 #{Time.zone.tzinfo}"))
          parsed_start_time_two = Time.zone.utc_to_local(Time.parse("#{day_month(day_two)} 00:00 #{Time.zone.tzinfo}"))

          availability_one = @availability.merge({
              :day => @day,
              :start_time => parsed_start_time_one,
              :end_time => parsed_end_time_one,
              :user_id => @current_user.id,
          })

          availability_two = @availability.merge({
              :day => @day,
              :start_time => parsed_start_time_two,
              :end_time => parsed_end_time_two,
              :user_id => @current_user.id,
          })

          availability_one = Availability.create(availability_one)
          availability_two = Availability.create(availability_two)

          @new_availabilities << availability_one
          @new_availabilities << availability_two
        end

        if @new_availabilities == []
          message = I18n.t('custom_errors.messages.unknown_error')
          raise Availabilities::Errors::UnknownAvailabilityError, message
        end

        Time.zone = 'UTC'
        @new_availabilities
      end

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

      def initialize_start_time
        Time.zone = @timezone
        start_time = @availability[:start_time].chars.last(23).first(6).join('')
        @parsed_start_time = Time.zone.parse("#{day_month(@day_index)} #{start_time} #{Time.zone.tzinfo}")
      end

      def initialize_end_time
        Time.zone = @timezone
        end_time = @availability[:end_time].chars.last(23).first(6).join('')
        @parsed_end_time = Time.zone.parse("#{day_month(@day_index)} #{end_time} #{Time.zone.tzinfo}")
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
