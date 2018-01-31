class ConversationsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_conversation, :check_participating!, only: [:new, :show, :update]

  caches_action :show, :new, :index

  def new
    redirect_to conversation_path(@conversation) and return if @conversation
    @message = current_user.messages.build
  end

  def index
    @conversations = Conversation.participating(current_user).order('updated_at DESC')
    @conversations = @conversations.collect { |conversation| ConversationDecorator.new(conversation, current_user).simple_decorate }

    @user = UserDecorator.new(current_user).simple_decorate

    @data = { :conversations => @conversations, :currentUser => @user }

    render :index
  end

  def show
    @conversation = ConversationDecorator.new(@conversation, current_user).decorate
    @user = UserDecorator.new(current_user).simple_decorate

    @data = { :conversation => @conversation, :currentUser => @user }

    render :show
  end

  def update
    @conversation.messages.unread.update_attributes(:unread => false)
    @conversation = ConversationDecorator.new(@conversation, current_user).decorate

    render json: { :conversation => @conversation }
  end

  private

  def set_conversation
    @conversation = Conversation.find_by(id: permitted_params[:id])
  end

  def check_participating!
    redirect_to '/inbox' unless @conversation.present? && @conversation.participates?(current_user)
  end

  def permitted_params
    params.permit(:id)
  end
end
