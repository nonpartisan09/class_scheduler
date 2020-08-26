# Preview all emails at http://localhost:3000/rails/mailers/user_mailer
class UserMailerPreview < ActionMailer::Preview
  def account_suspended
    UserMailer.account_suspended(
        User.first, 
        User.first, 
        Conversation.first, 
        Program.first
    )
  end

  def client_suspended_notification_eng
    UserMailer.client_suspended_notification_eng(
      User.first,
      User.first,
      Conversation.first,
      Program.first
    )
  end

  def client_suspended_notification_esp
    UserMailer.client_suspended_notification_esp(
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
