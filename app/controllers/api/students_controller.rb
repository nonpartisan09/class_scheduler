class Api::StudentsController < ApplicationController
  before_action :authenticate_api_student!
	def create
		@tutor = Tutor.new(tutor_params)
		if @tutor.save
			render 'api/tutors/show'
		else
			render json: @tutor.errors, status: :unprocessable_entity
		end
	end

	def update
		@tutor = Tutor.find(params[:id])

		if @tutor.update(tutor_params)
			render 'api/tutors/show'
		else
			render json: @tutor.errors, status: :unprocessable_entity
		end
	end

	def show
		@tutor = Tutor.find(params[:id])
	end

end
