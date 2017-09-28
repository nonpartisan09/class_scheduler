class PasswordsController < Devise::PasswordsController
  def new
    self.resource = resource_class.new
    respond_with(resource, render: :new)
  end
end
