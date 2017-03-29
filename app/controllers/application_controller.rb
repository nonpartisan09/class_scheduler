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

	def ensure_current_api_user
		if !current_api_user || current_api_user.id != params[:id].to_i
			render json: {errors: ["unauthorized"]}, status: 401
		end
	end
end
