class Api::SessionsController < ApplicationController

	def create
		@user = User.find_by_credentials(params[:user][:email], params[:user][:password])
		if @user
			login(@user)
			render 'api/users/show'
		else
			render json: ['invalid credentials'], status: 401
		end
	end

	def destroy
		@user = current_user
		logout if @user
		render json: {}, status: 200
	end

	def show
		@user = current_user
		@user ? render('api/users/show') : render(json: nil)
	end

end