class Api::RegistrationsController < Devise::RegistrationsController 

	def create
		debugger
		super
	end
	respond_to :json
end  