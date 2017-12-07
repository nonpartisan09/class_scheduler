class ConversationsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_conversation, :check_participating!, only: [:new, :show]

  def new
    redirect_to conversation_path(@conversation) and return if @conversation
    @message = current_user.messages.build
  end

  def index
    @conversations = Conversation.participating(current_user).order('updated_at DESC')
    @conversations = @conversations.collect { |conversation| ConversationDecorator.new(conversation).decorate }

    @user = UserDecorator.new(current_user).simple_decorate

    @data = { :conversations => @conversations, :currentUser => @user }
  end

  def show
    @message = Message.new
  end

  private

  def set_conversation
    @conversation = Conversation.find_by(id: params[:id])
  end

  def check_participating!
    redirect_to '/conversations' unless @conversation.present? && @conversation.participates?(current_user)
  end
end
