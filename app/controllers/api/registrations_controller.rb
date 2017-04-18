class Api::RegistrationsController < Devise::RegistrationsController 

	respond_to :json

	def create
		super do
			render "api/users/show" and return
		end
	end

	def resource_name
		:user
	end
end  