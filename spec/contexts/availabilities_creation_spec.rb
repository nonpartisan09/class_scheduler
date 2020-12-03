# frozen_string_literal: true
require 'rails_helper'

describe Contexts::Availabilities::Creation do
  def timestring(hhmmstr)
    "Fri Apr 10 2020 #{hhmmstr.strip} CDT -05:00"
  end

  describe 'Availability Creation Initialization' do
    volunteer = FactoryBot.create(:volunteer_user)

    it 'can be initialized' do
      expect do
        Contexts::Availabilities::Creation.new(
          { day: 2,
            start_time: "11:00",
            end_time: "13:00" },
          volunteer
        )
      end .not_to raise_error
    end

    it 'detects missing start time' do
      expect do
        Contexts::Availabilities::Creation.new(
          { day: 2,
            end_time: "13:00" },
          volunteer
        )
      end .to raise_error Contexts::Availabilities::Errors::StartTimeMissing
    end

    it 'detects invalid start time format due to space in front' do
      expect do
        Contexts::Availabilities::Creation.new(
          { day: 2,
            start_time: " 11:00",
            end_time: "13:00" },
          volunteer
        )
      end .to raise_error Contexts::Availabilities::Errors::StartTimeWrongFormat
    end

    it 'detects invalid start time format due to spance in back' do
      expect do
        Contexts::Availabilities::Creation.new(
          { day: 2,
            start_time: "11:00 ",
            end_time: "13:00" },
          volunteer
        )
      end .to raise_error Contexts::Availabilities::Errors::StartTimeWrongFormat
    end

    it 'detects invalid start time format due to hour outside range' do
      expect do
        Contexts::Availabilities::Creation.new(
          { day: 2,
            start_time: "24:00",
            end_time: "13:00" },
          volunteer
        )
      end .to raise_error Contexts::Availabilities::Errors::StartTimeWrongFormat
    end

    it 'detects invalid start time format due to minute outside range' do
      expect do
        Contexts::Availabilities::Creation.new(
          { day: 2,
            start_time: "12:60",
            end_time: "13:00" },
          volunteer
        )
      end .to raise_error Contexts::Availabilities::Errors::StartTimeWrongFormat
    end

    it 'detects missing end time' do
      expect do
        Contexts::Availabilities::Creation.new(
          { day: 2,
            start_time: "11:00" },
          volunteer
        )
      end .to raise_error Contexts::Availabilities::Errors::EndTimeMissing
    end

    it 'detects missing day of week' do
      expect do
        Contexts::Availabilities::Creation.new(
          { start_time: "11:00",
            end_time: "13:00" },
          volunteer
        )
      end .to raise_error Contexts::Availabilities::Errors::DayMissing
    end
    
  end

  describe 'Availability Creation Execution' do
    def init_availabilities
      @availability_times.each_with_index do |availability, _i|
        avail = Contexts::Availabilities::Creation.new(
          { day: 6,
            start_time: availability[:start_time],
            end_time: availability[:end_time] },
          @volunteer
        )
        avail.execute
      end
    end

    before(:each) do
      @volunteer = FactoryBot.create(:volunteer_user)
      @availability_times = [
        { start_time: "00:00", end_time: "01:00" },
        { start_time: "01:00", end_time: "02:00" },
        # around UTC change of day
        { start_time: "18:00", end_time: "19:00" },
        { start_time: "19:00", end_time: "20:00" },
        { start_time: "02:30", end_time: "03:45" },
        { start_time: "05:00", end_time: "07:00" }
      ]
    end

    context 'overlap checks' do
      it 'creates new availability with no overlap' do
        @availability_times.each do |availability|
          test_availability = Contexts::Availabilities::Creation.new(
            { day: 6,
              start_time: availability[:start_time],
              end_time: availability[:end_time] },
            @volunteer
          )
          expect { test_availability.execute }.not_to raise_error
        end
      end

      it 'detects if overlaps with existing start times' do
        init_availabilities
        new_availabilities = [
          { start_time: "00:59", end_time: "02:00" },
          { start_time: "17:45", end_time: "18:30" },
          { start_time: "18:59", end_time: "20:00" },
          { start_time: "00:01", end_time: "23:59" }
        ]
        new_availabilities.each do |availability|
          test_availability = Contexts::Availabilities::Creation.new(
            { day: 6,
              start_time: availability[:start_time],
              end_time: availability[:end_time] },
            @volunteer
          )
          expect { test_availability.execute }.to raise_error Contexts::Availabilities::Errors::OverlappingAvailability
        end
      end

      it 'detects if end time in existing overlap' do
        init_availabilities
        new_availabilities = [
          { start_time: "00:00", end_time: "01:01" },
          { start_time: "18:00", end_time: "18:31" },
          { start_time: "17:00", end_time: "18:01" },
          { start_time: "01:00", end_time: "02:02" }
        ]
        new_availabilities.each do |availability|
          test_availability = Contexts::Availabilities::Creation.new(
            { day: 6,
              start_time: availability[:start_time],
              end_time: availability[:end_time] },
            @volunteer
          )
          expect { test_availability.execute }.to raise_error Contexts::Availabilities::Errors::OverlappingAvailability
        end
      end

      it 'detects if it contains existing availability' do
        init_availabilities
        new_availabilities = [
          { start_time: "00:01", end_time: "00:41" },
          { start_time: "18:00", end_time: "18:31" },
          { start_time: "18:01", end_time: "18:45" }
        ]
        new_availabilities.each do |availability|
          test_availability = Contexts::Availabilities::Creation.new(
            { day: 6,
              start_time: availability[:start_time],
              end_time: availability[:end_time] },
            @volunteer
          )
          expect { test_availability.execute }.to raise_error Contexts::Availabilities::Errors::OverlappingAvailability
        end
      end
    end

    context 'minimum time period' do
      it 'detects availabilities less than 30 minutes' do
        short_availabilities = [
          { start_time: "17:45", end_time: "18:10" },
          { start_time: "00:00", end_time: "00:01" },
          { start_time: "23:31", end_time: "23:59" }
        ]
        short_availabilities.each do |availability|
          test_availability = Contexts::Availabilities::Creation.new(
            { day: 6,
              start_time: availability[:start_time],
              end_time: availability[:end_time] },
            @volunteer
          )
          expect { test_availability.execute }.to raise_error Contexts::Availabilities::Errors::ShortAvailability
        end
      end

      it 'allow availabilities of 30 minutes' do
        good_availabilities = [
          { start_time: "17:45", end_time: "18:15" },
          { start_time: "00:00", end_time: "00:31" }
        ]
        good_availabilities.each do |availability|
          test_availability = Contexts::Availabilities::Creation.new(
            { day: 6,
              start_time: availability[:start_time],
              end_time: availability[:end_time] },
            @volunteer
          )
          expect { test_availability.execute }.not_to raise_error
        end
      end
    end

    context 'starts before it ends' do
      it 'detects ends before starts' do
        bad_availabilities = [
          { start_time: "18:01", end_time: "17:30" },
          { start_time: "01:00", end_time: "00:00" },
          { start_time: "23:59", end_time: "00:00" }
        ]
        bad_availabilities.each do |availability|
          test_availability = Contexts::Availabilities::Creation.new(
            { day: 6,
              start_time: availability[:start_time],
              end_time: availability[:end_time] },
            @volunteer
          )
          expect { test_availability.execute }.to raise_error Contexts::Availabilities::Errors::ShortAvailability
        end
      end
    end
  end
end
