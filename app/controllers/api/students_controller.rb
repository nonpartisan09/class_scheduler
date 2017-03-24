class Api::StudentsController < ApplicationController
  before_action :authenticate_api_student!, except: [:create]
	def create
		debugger
		@student = Student.new(student_params)
		if @student.save
			render 'api/students/show'
		else
			render json: @student.errors, status: :unprocessable_entity
		end
	end

	def update
		@student = Student.find(params[:id])

		if @student.update(student_params)
			render 'api/students/show'
		else
			render json: @student.errors, status: :unprocessable_entity
		end
	end

	def show
		@student = Student.find(params[:id])
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
			:language
		)
	end

end
