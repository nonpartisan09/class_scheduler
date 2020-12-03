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
            start_time: timestring('11:00:40'),
            end_time: timestring('13:00:40') },
          volunteer
        )
      end .not_to raise_error
    end

    it 'detects missing start time' do
      expect do
        Contexts::Availabilities::Creation.new(
          { day: 2, end_time: timestring('13:00:40') },
          volunteer
        )
      end .to raise_error Contexts::Availabilities::Errors::StartTimeMissing
    end

    it 'detects missing end time' do
      expect do
        Contexts::Availabilities::Creation.new(
          { day: 2, start_time: timestring('13:00:40') },
          volunteer
        )
      end .to raise_error Contexts::Availabilities::Errors::EndTimeMissing
    end

    it 'detects missing day of week'
    # it "detects missing day of week" do
    #   expect {
    #     Contexts::Availabilities::Creation.new(
    #       { start_time: "13:00", end_time: "14:00" },
    #       volunteer
    #     )}.to raise_error (Contexts::Availabilities::Errors::DayMissing)
    # end
  end

  describe 'Availability Creation Execution' do
    def init_availabilities
      @availability_times.each_with_index do |availability, _i|
        avail = Contexts::Availabilities::Creation.new(
          { day: 6,
            start_time: availability[:start],
            end_time: availability[:end] },
          @volunteer
        )
        avail.execute
      end
    end

    before(:each) do
      @volunteer = FactoryBot.create(:volunteer_user)
      @availability_times = [
        { start: timestring('00:00:00'), end: timestring('01:00:40') },
        { start: timestring('01:00:32'), end: timestring('02:00:48') },
        # around UTC change of day
        { start: timestring('18:00:32'), end: timestring('19:00:32') },
        { start: timestring('19:00:58'), end: timestring('20:00:06') },
        { start: timestring('02:30:17'), end: timestring('03:45:19') },
        { start: timestring('05:00:17'), end: timestring('07:00:19') }
      ]
    end

    context 'overlap checks' do
      it 'creates new availability with no overlap' do
        @availability_times.each do |availability|
          test_availability = Contexts::Availabilities::Creation.new(
            { day: 6,
              start_time: availability[:start],
              end_time: availability[:end] },
            @volunteer
          )
          expect { test_availability.execute }.not_to raise_error
        end
      end

      # it 'detects if overlaps with existing start times' do
      #   init_availabilities
      #   new_availabilities = [
      #     { start: timestring('00:59:17'), end: timestring('02:00:19') },
      #     { start: timestring('17:45:17'), end: timestring('18:30:19') },
      #     { start: timestring('18:59:17'), end: timestring('20:00:19') },
      #     { start: timestring('00:01:17'), end: timestring('23:59:19') }
      #   ]
      #   new_availabilities.each do |availability|
      #     test_availability = Contexts::Availabilities::Creation.new(
      #       { day: 6,
      #         start_time: availability[:start],
      #         end_time: availability[:end] },
      #       @volunteer
      #     )
      #     expect { test_availability.execute }.to raise_error Contexts::Availabilities::Errors::OverlappingAvailability
      #   end
      # end

      it 'detects if end time in existing overlap' do
        init_availabilities
        new_availabilities = [
          { start: timestring('00:00:17'), end: timestring('01:01:19') },
          { start: timestring('18:00:17'), end: timestring('18:31:19') },
          { start: timestring('17:00:17'), end: timestring('18:01:19') },
          { start: timestring('01:00:17'), end: timestring('02:02:19') }
        ]
        new_availabilities.each do |availability|
          test_availability = Contexts::Availabilities::Creation.new(
            { day: 6,
              start_time: availability[:start],
              end_time: availability[:end] },
            @volunteer
          )
          expect { test_availability.execute }.to raise_error Contexts::Availabilities::Errors::OverlappingAvailability
        end
      end

      it 'detects if it contains existing availability' do
        init_availabilities
        new_availabilities = [
          { start: timestring('00:01:17'), end: timestring('00:41:19') },
          { start: timestring('18:00:17'), end: timestring('18:31:19') },
          { start: timestring('18:01:17'), end: timestring('18:45:19') }
        ]
        new_availabilities.each do |availability|
          test_availability = Contexts::Availabilities::Creation.new(
            { day: 6,
              start_time: availability[:start],
              end_time: availability[:end] },
            @volunteer
          )
          expect { test_availability.execute }.to raise_error Contexts::Availabilities::Errors::OverlappingAvailability
        end
      end
    end

    context 'minimum time period' do
      it 'detects availabilities less than 30 minutes' do
        short_availabilities = [
          { start: timestring('17:45:17'), end: timestring('18:10:19') },
          { start: timestring('00:00:17'), end: timestring('00:01:19') },
          { start: timestring('23:30:17'), end: timestring('23:59:19') }
        ]
        short_availabilities.each do |availability|
          test_availability = Contexts::Availabilities::Creation.new(
            { day: 6,
              start_time: availability[:start],
              end_time: availability[:end] },
            @volunteer
          )
          expect { test_availability.execute }.to raise_error Contexts::Availabilities::Errors::ShortAvailability
        end
      end

      it 'allow availabilities of 30 minutes' do
        good_availabilities = [
          { start: timestring('17:45:17'), end: timestring('18:15:19') },
          { start: timestring('00:00:17'), end: timestring('00:31:19') }
        ]
        good_availabilities.each do |availability|
          test_availability = Contexts::Availabilities::Creation.new(
            { day: 6,
              start_time: availability[:start],
              end_time: availability[:end] },
            @volunteer
          )
          expect { test_availability.execute }.not_to raise_error
        end
      end
    end

    context 'starts before it ends' do
      it 'detects ends before starts' do
        bad_availabilities = [
          { start: timestring('18:01:17'), end: timestring('17:30:19') },
          { start: timestring('01:00:17'), end: timestring('00:00:19') },
          { start: timestring('23:59:17'), end: timestring('00:00:19') }
        ]
        bad_availabilities.each do |availability|
          test_availability = Contexts::Availabilities::Creation.new(
            { day: 6,
              start_time: availability[:start],
              end_time: availability[:end] },
            @volunteer
          )
          expect { test_availability.execute }.to raise_error Contexts::Availabilities::Errors::ShortAvailability
        end
      end
    end
  end
end
