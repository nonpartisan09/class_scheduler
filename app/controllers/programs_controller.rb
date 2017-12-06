class ProgramsController < ApplicationController

  def new
    @program = Program.new
    @program.name = params[:name]
    @program.save
  end

  def index
    @programs = Program.all

    respond_with(@programs)
  end

  private

  def permitted_params
    params.permit(
      :name,
      :description
    )
  end
end
