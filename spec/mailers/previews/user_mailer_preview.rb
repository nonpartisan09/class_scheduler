# Preview all emails at http://localhost:3000/rails/mailers/user_mailer
class UserMailerPreview < ActionMailer::Preview
  def untimely_response
    UserMailer.untimely_response(
        User.first, 
        User.first, 
        Conversation.first, 
        Program.first
    )
  end

  def client_untimely_response_eng
    UserMailer.client_untimely_response_eng(
      User.first,
      User.first,
      Conversation.first,
      Program.first
    )
  end

  def client_untimely_response_esp
    UserMailer.client_untimely_response_esp(
      User.first,
      User.first,
      Conversation.first,
      Program.first
    )
  end

  def account_inactive
    UserMailer.account_inactive(
      User.first
    )
  end


end
