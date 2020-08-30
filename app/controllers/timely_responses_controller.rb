class TimelyResponsesController < ApplicationController
    def create
        TimelyResponse.create!({
            user_id: current_user.id,
            # conversation_id: params[:conversation_id]
        })
    end

    def destroy
        puts "\n\n\n\n\n\n\n"
        puts "$$$$$$"
        puts params
        puts "$$$$$$"
        puts "\n\n\n\n\n\n\n"
        # res = { user_id: current_user.id }
        # res[:conversation_id] = params[conversation_id] if params[conversation_id]
        timely_response = TimelyResponse.find(params[:id])
        timely_response.destroy!
    end
end