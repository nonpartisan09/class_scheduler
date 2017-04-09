class Api::RegistrationsController < Devise::RegistrationsController 

	respond_to :json

	def resource_name
		:user
	end
end  