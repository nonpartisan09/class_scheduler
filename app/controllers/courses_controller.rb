class CoursesController < ApplicationController

  def new
    @course = Course.new
    @course.name = params[:name]
    @course.save
  end

  private

  def permitted_params
    params.permit(
      :name,
      :description
    )
  end
end
