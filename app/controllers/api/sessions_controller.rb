class Api::SessionsController < ApplicationController
	def destroy
		@user = current_api_user 
		if @user
			sign_out(@user)
			render json: @user
		else 
			render json: {errors: "not logged in"}, status: 422
		end
	end

	def create
		@user = User.find_by_email(params[:email])

		if @user && @user.valid_password?(params[:password])
			sign_in(@user)
			type = @user.type.downcase
			render "api/#{type.pluralize}/show", locals: { type.to_sym => @user }
		else 
			render json: {server: ["invalid email/password combination"]}, status: 401
		end


	end

end
