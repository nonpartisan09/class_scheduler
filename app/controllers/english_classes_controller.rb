class EnglishClassesController < ApplicationController
  before_action :set_english_class, only: [:show, :edit, :update, :destroy]

  # GET /english_classes
  # GET /english_classes.json
  def index
    @english_classes = EnglishClass.all
  end

  # GET /english_classes/1
  # GET /english_classes/1.json
  def show
  end

  # GET /english_classes/new
  def new
    @english_class = EnglishClass.new
  end

  # GET /english_classes/1/edit
  def edit
  end

  # POST /english_classes
  # POST /english_classes.json
  def create
    @english_class = EnglishClass.new(english_class_params)

    respond_to do |format|
      if @english_class.save
        format.html { redirect_to @english_class, notice: 'English class was successfully created.' }
        format.json { render :show, status: :created, location: @english_class }
      else
        format.html { render :new }
        format.json { render json: @english_class.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /english_classes/1
  # PATCH/PUT /english_classes/1.json
  def update
    respond_to do |format|
      if @english_class.update(english_class_params)
        format.html { redirect_to @english_class, notice: 'English class was successfully updated.' }
        format.json { render :show, status: :ok, location: @english_class }
      else
        format.html { render :edit }
        format.json { render json: @english_class.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /english_classes/1
  # DELETE /english_classes/1.json
  def destroy
    @english_class.destroy
    respond_to do |format|
      format.html { redirect_to english_classes_url, notice: 'English class was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_english_class
      @english_class = EnglishClass.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def english_class_params
      params.require(:english_class).permit(:class_date, :class_time)
    end
end
