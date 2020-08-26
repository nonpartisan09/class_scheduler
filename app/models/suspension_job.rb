class SuspensionJob < Struct.new(:conversation, :volunteer, :client, :program)

  def client_email
   if client.locale === 'en'
     UserMailer.client_suspended_notification_eng(volunteer, client, conversation, program).deliver_later
   elsif client.locale === 'es'
     UserMailer.client_suspended_notification_esp(volunteer, client, conversation, program).deliver_later
   end
  end

  def volunteer_email
   UserMailer.account_suspended(volunteer, client, conversation, program).deliver_later
  end

  def perform

    if !volunteer.can_unsuspend?  # should we suspend the user?
      client_email
      volunteer_email
      volunteer.create_suspension({user_id: volunteer.id})
    end

  end

end

