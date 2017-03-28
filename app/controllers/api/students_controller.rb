class Api::StudentsController < ApplicationController
  before_action :authenticate_api_student!, except: [:create]
	def create
		@user = Student.new(user_params)
		if @user.save
			sign_in(@user)
			render 'api/students/show'
		else
			p @user.errors.messages
			render json: @user.errors, status: :unprocessable_entity
		end
	end

	def update
		@user = Student.find(params[:id])
		if @user.update(user_params)
			render 'api/students/show'
		else
			render json: @user.errors, status: :unprocessable_entity
		end
	end

	def show
		@user = Student.find(params[:id])
	end

	private 
	def student_params
		params.require(:user).permit(
			:email, 
			:password, 
			:phone_number, 
			:f_name, 
			:l_name, 
			:profile_src, 
			:image,
			:language
		)
	end

end
