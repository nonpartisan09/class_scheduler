class AdminController < Devise::SessionsController
  before_action :redirect_if_not_admin

  def become
    sign_in(:user, User.find(permitted_params[:id]), { :bypass => true })
    redirect_to admin_dasboard_path
  end

  def deactivate_user
    user = User.find!(permitted_params[:id])
    user.active = false
    user.save!

    force_sign_out(user)

    UserMailer.account_deactivated(self).deliver_later
    redirect_to admin_dasboard_path
  end

  private

  def force_sign_out(user)
    sign_out(:user, user)
  end

  def redirect_if_not_admin
    return unless current_user.admin? || current_user.admins_readonly?
  end

  def permitted_params
    params.permit(:id)
  end
end
