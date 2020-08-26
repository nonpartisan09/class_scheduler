# Preview all emails at http://localhost:3000/rails/mailers/user_mailer
class UserMailerPreview < ActionMailer::Preview
  def account_inactive
    UserMailer.account_inactive(
      User.first
    )
  end
end
