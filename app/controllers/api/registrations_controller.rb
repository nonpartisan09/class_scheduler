class Api::RegistrationsController < Devise::RegistrationsController 

	respond_to :json

	def create
		super do |resource|
			sign_in(@user) if @user.valid?
			redirect_to api_current_user_path and return
		end
	end

	def resource_name
		:user
	end
end  