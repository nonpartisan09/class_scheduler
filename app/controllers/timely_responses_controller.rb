class TimelyResponsesController < ApplicationController
    def create
        TimelyResponse.create!({
            user_id: current_user.id
        })
    end

    def destroy
        timely_response = TimelyResponse.where(user_id: params[:id])
        timely_response.each(&:destroy!)
    end
end