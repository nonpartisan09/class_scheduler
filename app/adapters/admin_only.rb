class AdminOnly < ActiveAdmin::AuthorizationAdapter
  def authorized?(action, subject = nil)
    if user.present?
      user.admin?
    else
      false
    end
  end
end
