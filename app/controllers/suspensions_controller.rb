class SuspensionsController < ApplicationController

  def create
    Suspension.create!({user_id: params[:user_id]})
  end

  def destroy
    suspension = Suspension.find_by({user_id: params[:user_id]})
    suspension.destroy!
  end

end