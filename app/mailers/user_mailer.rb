class UserMailer < ApplicationMailer
  def welcome_email(user)
    @user = user

    if @user.volunteer?
      @role = "volunteer"
    elsif @user.client?
      @role = "client"
    else
      @role = "user"
    end

    @url = url

    mail(to: @user.email, subject: 'Welcome to tutoría')
  end

  def new_message(user, sender, message)
    @user, @sender, @message = user, sender, message
    @url = url
    mail(to: @user.email, subject: `New message from #{sender} - tutoría`)
  end

  def account_deactivated(user)
    @user = user
    @admin_email = admin_email
    mail(to: @user.email, subject: 'Tutoría Account Disabled')
  end

  def account_reactivated(user)
    @user = user
    @admin_email = admin_email

    mail(to: @user.email, subject: 'Tutoría Account Re-enabled')
  end

  def account_deleted(user)
    @user = user

    mail(to: @user.email, subject: 'Tutoría Account Deleted')
  end

  private

  def url
   'https://tutoria-staging.herokuapp.com/sign_in'
  end

  def admin_email
    'admin@tutoria.io'
  end
end
