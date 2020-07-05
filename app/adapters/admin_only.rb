class AdminOnly < ActiveAdmin::AuthorizationAdapter
  def authorized?(action, subject = nil)
    if user.present?
      user.admin? || user.admins_readonly?
    else
      false
    end
  end
end
