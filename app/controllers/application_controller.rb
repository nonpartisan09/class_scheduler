class ApplicationController < ActionController::Base
  # protect_from_forgery with: :exception
  before_action :configure_permitted_parameters, if: :devise_controller?
  before_action :set_locale
  before_action :sign_out_if_inactive, if: -> { current_user.present? && !current_user.active }
  
  rescue_from ActionController::RoutingError, :with => :not_found
  respond_to :json, :xml, :html, :plain

  def index
    decorate_user_if_present
    programs = Program.featured

    @data = {
        :currentUser => @user,
        :programs => programs,
        :locale => I18n.locale.to_s
    }

    render :index
  end

  def about_page
    decorate_user_if_present

    page_content = AboutPage.last
    page_content = {
        :en => page_content[:description],
        :es => page_content[:spanish_description]
    }

    @data = {
        :currentUser => @user,
        :page_content => page_content,
        :locale => I18n.locale.to_s
    }

    render :custom_page
  end

  def faq_page
    decorate_user_if_present

    page_content = FaqPage.last
    page_content = {
        :en => page_content[:description],
        :es => page_content[:spanish_description]
    }

    @data = {
        :currentUser => @user,
        :page_content => page_content,
        :locale => I18n.locale.to_s
    }

    render :custom_page
  end

  def volunteer_sign_up_completed_page
    decorate_user_if_present

    page_content_en = <<-EOF
<p>Thank you for completing the first part of volunteer signup. We just emailed you with next steps. If you didn't receive our email, please let us know at <a href="mailto:volunteer@tutoria.io">volunteer@tutoria.io</a>.</p>
    EOF
    page_content_es = <<-EOF
<p>Gracias por completar la primera parte de su registración como voluntario/a. Le acabamos de enviar un correo electrónico con los pasos a seguir. Si usted no ha recibido nuestro correo electrónico todavía, por favor déjenoslo saber escribiéndonos a <a href="mailto:volunteer@tutoria.io">volunteer@tutoria.io</a>.</p>
    EOF
    page_content = {
        :en => page_content_en,
        :es => page_content_es
    }

    @data = {
        :currentUser => @user,
        :page_content => page_content,
        :locale => I18n.locale.to_s
    }

    render :custom_page
  end

  def t_and_c
    decorate_user_if_present

    terms_and_conditions = TermsAndConditions.last
    terms_and_conditions = terms_and_conditions[:description]

    @data = {
        :currentUser => @user,
        :terms_and_conditions => terms_and_conditions,
        :locale => I18n.locale.to_s
    }

    render :t_and_c
  end

  def not_found
    decorate_user_if_present

    @data = {
        :currentUser => @user,
        :locale => I18n.locale.to_s
    }
  end
  
  def sitemap
    @pages = ["", "/about", "/faq" , "/sign_up/client", "/sign_up/volunteer", "/terms_of_use" ]
    headers['Content-Type'] = 'application/xml'
    @host = "#{request.protocol}#{request.host}"
  end

  def robots
    headers['Content-Type'] = 'text/plain'
    @host = "#{request.protocol}#{request.host}"
  end

  def set_locale
    @languages = ["", "en", "es"]
    locale_extracted = "en" #default
    
    if request.env['HTTP_ACCEPT_LANGUAGE']
      browser_locale = extract_locale_from_headers
      browser_locale.each do |loc| 
        if @languages.include? loc
          locale_extracted = loc
          break
        end
      end
    end 
    params.permit(:locale)
    I18n.locale = params[:locale] || locale_extracted
    
  end
  
  def extract_locale_from_headers
    request.env['HTTP_ACCEPT_LANGUAGE'].scan(/[a-z]{2}/).uniq 
  end

  protected

  def authenticate_admin_user!
    unless user_signed_in? || request.referer != new_user_session_path
      user = User.find_by_email!(params[:user][:email])

      if user.admin? || user.owner?
        authenticate_user!
      else
        redirect_to root_path and return
      end
    end
  end

  def after_sign_in_path_for(resource)
    session["user_return_to"] || root_url
  end

  def access_denied(exception)
    redirect_to root_path, alert: exception.message
  end

  def configure_permitted_parameters
    attributes = [ :thumbnail_image ]
    devise_parameter_sanitizer.permit(:sign_in, keys: attributes)
    devise_parameter_sanitizer.permit(:sign_up, keys: attributes)
    devise_parameter_sanitizer.permit(:account_update, keys: attributes)
  end

  private

  def decorate_user_if_present
    if current_user
      user = UserDecorator.new(current_user)
      @user = user.simple_decorate
    else
      @user = { }
    end
  end

  def sign_out_if_inactive
    sign_out
  end
end
