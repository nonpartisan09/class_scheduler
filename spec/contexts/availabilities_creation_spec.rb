require 'rails_helper'

describe Contexts::Availabilities::Creation do

  describe "Availability Creation Initialization" do
    volunteer = FactoryBot.create(:volunteer_user)
    it "can be initialized" do
      expect { 
        Contexts::Availabilities::Creation.new(
          { day: "Wednesday", start_time: "11:00", end_time: "13:00" },
          volunteer
        )}.not_to raise_error
    end
    it "detects missing start time" do
      expect { 
        Contexts::Availabilities::Creation.new(
          { day: "Wednesday", end_time: "13:00" },
          volunteer
        )}.to raise_error (Contexts::Availabilities::Errors::StartTimeMissing)
    end
    it "detects missing end time" do
      expect { 
        Contexts::Availabilities::Creation.new(
          { day: "Wednesday", start_time: "13:00" },
          volunteer
        )}.to raise_error (Contexts::Availabilities::Errors::EndTimeMissing)
    end
    it "detects missing day of week"
    # it "detects missing day of week" do
    #   expect { 
    #     Contexts::Availabilities::Creation.new(
    #       { start_time: "13:00", end_time: "14:00" },
    #       volunteer
    #     )}.to raise_error (Contexts::Availabilities::Errors::DayMissing)
    # end
  end

  describe "Availability Creation Execution" do
    before(:each) do
      @volunteer = FactoryBot.create(:volunteer_user)
      availability1 = Contexts::Availabilities::Creation.new(
        { day: "Wednesday", start_time: "11:00", end_time: "13:00" },
        @volunteer
      )
      availability1.execute # 'save' it
    end
    context "overlap checks" do
      it "creates new availability with no overlap" do
        availability2 = Contexts::Availabilities::Creation.new(
          { day: "Wednesday", start_time: "13:00", end_time: "14:00" },
          @volunteer
        )
        expect {availability2.execute}.not_to raise_error          
      end
      it "detects if start time in existing overlap" do
        availability2 = Contexts::Availabilities::Creation.new(
          { day: "Wednesday", start_time: "12:00", end_time: "14:00" },
          @volunteer
        )
        expect {availability2.execute}.to raise_error (Contexts::Availabilities::Errors::OverlappingAvailability)  
      end
      it "detects if end time in existing overlap" do
        availability2 = Contexts::Availabilities::Creation.new(
          { day: "Wednesday", start_time: "10:00", end_time: "12:00" },
          @volunteer
        )
        expect {availability2.execute}.to raise_error (Contexts::Availabilities::Errors::OverlappingAvailability)  
      end
      it "detects if it contains existing availability" do
        availability2 = Contexts::Availabilities::Creation.new(
          { day: "Wednesday", start_time: "10:00", end_time: "15:00" },
          @volunteer
        )
        expect {availability2.execute}.to raise_error (Contexts::Availabilities::Errors::OverlappingAvailability)  
      end
    end

     context "minimum time period" do
       it "detects availabilities less than 30 minutes"
       it "detects correct time period with day spans"
     end

     context "starts before it ends" do
       it "detects ends before starts" 
       it "detects end before start with day spans"
     end
  end
end
