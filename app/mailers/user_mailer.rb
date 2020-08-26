class UserMailer < ApplicationMailer
  def client_welcome_email(user, password='')
    @user = user
    @password = password
    @url = url
    @domain = domain_name
    @locale = locale
    I18n.with_locale(@locale) do
      mail(
          to: @user.email,
          subject: I18n.translate('application_mailer.welcome_message.title')
      )
    end
  end

  def volunteer_welcome_email(user, password='')
    @user = user
    @password = password
    @url = url
    @domain = domain_name
    @role = "volunteer"
    @locale = locale
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

  def account_activated(user)
    @user = user
    @admin_email = admin_email

    mail(to: @user.email, subject: 'Please set your availabilities in tutoría')
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

  def account_suspended(volunteer, client, conversation, program)
    @volunteer, @client, @conversation, @program = volunteer, client, conversation, program
    @url = "https://tutoria.io/#{@volunteer.locale}/inbox/#{@conversation.id}"
    mail(to: @volunteer.email, subject: 'Untimely response to client message - Tutoría')
  end

  def client_suspended_notification_eng(volunteer, client, conversation, program)
    @volunteer, @client, @conversation, @program = volunteer, client, conversation, program
    @url = "https://tutoria.io/#{@volunteer.locale}/inbox/#{@conversation.id}"
    mail(to: @client.email, subject: 'Volunteer Unavailable - Tutoría')
  end

  def client_suspended_notification_esp(volunteer, client, conversation, program)
    @volunteer, @client, @conversation, @program = volunteer, client, conversation, program
    @url = "https://tutoria.io/#{@volunteer.locale}/inbox/#{@conversation.id}"
    mail(to: @client.email, subject: 'Voluntario/a no disponible - Tutoría')
  end

  private

  def domain_name
    Rails.configuration.base_domain
  end

  def url
   "#{domain_name}/sign_in"
  end

  def admin_email
    'admin@tutoria.io'
  end
end
