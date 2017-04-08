class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  
  def user_params
		params.require(:user).permit(
			:email, 
			:password, 
			:first_name, 
			:last_name, 
			image: [:public_id]
			:language
		)
	end

end
