class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  def user_params
		params.require(:user).permit(
			:email, 
			:password, 
			:phone_number, 
			:f_name, 
			:l_name, 
			:type, 
			:image, 
			:profile_src,
			:language
		)
	end

	def authenticate_user_is_tutor
		current_api_user.is_a?(Tutor)
	end


end
