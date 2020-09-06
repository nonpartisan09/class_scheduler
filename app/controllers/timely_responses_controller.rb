class TimelyResponsesController < ApplicationController
    def create
        TimelyResponse.create!({
            user_id: current_user.id
        })
    end

    def destroy
        timely_response = TimelyResponse.find(params[:id])
        timely_response.destroy!
    end
end