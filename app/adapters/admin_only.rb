class AdminOnly < ActiveAdmin::AuthorizationAdapter
  def authorized?(action, subject = nil)
    if user.present?
      user.admin? || user.admins_readonly? || user.owner?
    else
      false
    end
  end
end
