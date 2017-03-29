class Api::KlassesController < ApplicationController

	before_action :authenticate_api_user!, only: [:create]
	before_action :authenticate_user_is_tutor, only: [:create]

	def create
		@klass = Klass.new(klass_params)
		@klass.tutor = current_api_user
		if @klass.save
			render 'api/klasses/show'
		else
			render json: @klass.errors, status: 422
		end

	end

	private
	def klass_params
		params.require(:klass).permit(
			:title,
			:description,
			:category,
			:language,
			availability: [
				:sun_mor,
				:sun_aft,
				:sun_eve,
				:mon_mor,
				:mon_aft,
				:mon_eve,
				:tue_mor,
				:tue_aft,
				:tue_eve,
				:wed_mor,
				:wed_aft,
				:wed_eve,
				:thu_mor,
				:thu_aft,
				:thu_eve,
				:fri_mor,
				:fri_aft,
				:fri_eve,
				:sat_mor,
				:sat_aft,
				:sat_eve,
			]
		)
	end
end
