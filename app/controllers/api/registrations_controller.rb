class Api::RegistrationsController < Devise::RegistrationsController 

	respond_to :json

	def create
		render "api/users/show"
	end

	def resource_name
		:user
	end
end  