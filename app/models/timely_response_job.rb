class TimelyResponseJob < Struct.new(:conversation, :volunteer, :client, :program)

  def client_email
   if client.locale === 'en'
     UserMailer.client_untimely_response_eng(volunteer, client, conversation, program).deliver_later
   elsif client.locale === 'es'
     UserMailer.client_untimely_response_esp(volunteer, client, conversation, program).deliver_later
   end
  end

  def volunteer_email
   UserMailer.untimely_response(volunteer, client, conversation, program).deliver_later
  end

  def perform

    if !volunteer.timely_responses?
      client_email
      volunteer_email

      conversation.create_timely_response({user_id: volunteer.id, conversation_id: conversation.id})
    end

  end

end

