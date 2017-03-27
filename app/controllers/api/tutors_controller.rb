class Api::TutorsController < ApplicationController
  before_action :authenticate_api_tutor!, except: [:create]
	def create
		@user = Tutor.new(tutor_params)
		if @user.save
			render 'api/tutors/show'
		else
			render json: @user.errors, status: :unprocessable_entity
		end
	end

	def update
		@user = Tutor.find(params[:id])

		if @user.update(tutor_params)
			render 'api/tutors/show'
		else
			render json: @user.errors, status: :unprocessable_entity
		end
	end

	def show
		@user = Tutor.find(params[:id])
	end

	def index
		@users = Tutor.joins(:schedules).all

		unless tutor_search_params.empty?
			@users = @users.where(tutor_search_params)
		end

		unless klass_params.empty?
			@users = @users.where(klasses: klass_params)
		end

		unless schedule_params.empty?
			@users = @users.where(schedules: schedule_params)
		end

		# checks class description field by presence of keywords instead of exact match

		if keywords
			@users = filter_by_keywords(@users, keywords.split(" ").map(&:strip))
		end

	end

	private

	def keywords
		params.fetch(:class, {}).permit(:description)[:description]
	end

	def filter_by_keywords(query, keywords)
		keywords.each do |kw|
			query = query.where("klasses.description like ?", "%#{kw}%")
		end
		query
	end

	def tutor_params
		params.require(:user).permit(
			:email, 
			:password, 
			:phone_number, 
			:f_name, 
			:l_name, 
			:profile_src, 
			:type, 
		)
	end

	def tutor_search_params
		params.fetch(:tutor, {}).permit(
			:f_name, 
			:l_name, 
		).to_h
	end

	def klass_params
		params.fetch(:class, {}).permit(
			:id,
			:category,
			:title,
			:keywords
		).to_h
	end

	def schedule_params
		params.fetch(:schedule, {}).permit(
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
		:sat_eve
		).to_h
	end
end
