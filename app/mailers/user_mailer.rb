class UserMailer < ApplicationMailer
  def welcome_email(user)
    @user = user
    @url  = 'https://tutoria-staging.herokuapp.com/sign_in'
    mail(to: @user.email, subject: 'Welcome to Tutoría')
  end
end
