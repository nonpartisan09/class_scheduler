class Api::SessionsController < Devise::SessionsController  
	respond_to :json

	def current_user
		@user = current_api_user
		render "api/users/show"
	end

end  