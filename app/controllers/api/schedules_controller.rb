class Api::SchedulesController < ApplicationController
	before_action :authenticate_api_tutor!
end
