class SessionsController < Devise::SessionsController
  def new
    self.resource = resource_class.new(sign_in_params)

    @student_role = Role.find_by_url_slug('student').url_slug
    @volunteer_role = Role.find_by_url_slug('volunteer').url_slug

    if self.resource.email.present?
      @message = "It seems you have entered the wrong credentials."
    end

    clean_up_passwords(resource)
    yield resource if block_given?
    respond_with(resource, serialize_options(resource))
  end

  def create
    self.resource = warden.authenticate!(auth_options)
    sign_in(resource_name, resource)
    yield resource if block_given?
    respond_with resource, location: after_sign_in_path_for(resource)
  end

  def destroy
    Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name)
    yield if block_given?

    respond_to_on_destroy
  end
end
