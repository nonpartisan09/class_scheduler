class UserMailer < ApplicationMailer
  def welcome_email(user, password='')
    @user = user
    @password = password

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
    I18n.with_locale(@user.locale) do
      mail(
          to: @user.email,
          subject: "#{I18n.translate 'application_mailer.new_message.title'}: #{sender.first_name} - tutoría"
      )
    end
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

  def password_updated(user)
    @user = user
    @admin_email = admin_email

    mail(to: @user.email, subject: 'Tutoría Password Updated')
  end

  private

  def url
   'https://tutoria-staging.herokuapp.com/sign_in'
  end

  def admin_email
    'admin@tutoria.io'
  end
end
