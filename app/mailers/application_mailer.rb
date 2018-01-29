module Roadie::Rails::InlineOnDelivery
  def deliver_now
    inline_styles
    super
  end
end

class ApplicationMailer < ActionMailer::Base
  include Roadie::Rails::Automatic

  before_action :attach_header_image

  ADMIN_ADDRESS = 'admin@tutoria.io'

  default from: 'no-reply@tutoria.io'
  layout 'mailer'

  def roadie_options
    super.merge(url_options: Rails.configuration.roadie_options)
  end

  def attach_header_image
    attachments.inline['logo.png'] = File.read('app/assets/images/tutoria_logo_full color_web.png')
  end
end
