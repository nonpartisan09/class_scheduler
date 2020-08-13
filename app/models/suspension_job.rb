class SuspensionJob < Struct.new(:conversation, :volunteer, :client)

  def client_email
  end

  def volunteer_email
  end

  def perform
    if !volunteer.can_unsuspend?  # should we suspend the user?
      client_email
      volunteer_email
      volunteer.create_suspension({user_id: volunteer.id})

      # UserMailer.account_suspended(volunteer, client, conversation)).deliver_later

    end

  end

end

