class UserMailer < ApplicationMailer
  def welcome_email(user)
    @user = user
    @url  = 'https://tutoria-staging.herokuapp.com/sign_in'
    mail(to: @user.email, subject: 'Welcome to tutoría')
  end

  def new_message(user, sender, message)
    @user, @sender, @message = user, sender, message
    @url  = 'https://tutoria-staging.herokuapp.com/inbox'
    mail(to: @user.email, subject: `New message from #{sender} - tutoría`)
  end
end
