class Api::UsersController < ApplicationController

	def current_user
		@user = current_api_user
		render "api/users/show"
	end
end
