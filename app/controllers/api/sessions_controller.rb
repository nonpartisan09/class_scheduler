class Api::SessionsController < Devise::SessionsController  
	respond_to :json

	def create
		super do 
			debugger
		end
	end

	def current_user
		@user = current_api_user
		render "api/users/show"
	end

	def resource_name
		:user
	end
end  