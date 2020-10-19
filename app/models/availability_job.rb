class AvailabilityJob < Struct.new(:volunteer)

  def availability_email
    UserMailer.account_inactive(volunteer).deliver_later
  end

  def perform
    if !volunteer.availabilities.first
      availability_email
    end
  end

end