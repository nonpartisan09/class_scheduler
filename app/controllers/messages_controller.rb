class MessagesController < ApplicationController
  before_action :authenticate_user!
  before_action :find_conversation!, except: [ :update ]
  def new
    @message = current_user.messages.build
    @user = UserDecorator.new(current_user).simple_decorate
    @data = { :message => @message, :currentUser => @user }
  end

  def create
    @conversation ||= Conversation.create(author_id: current_user.id,
        recipient_id: @recipient.id)
    @message = current_user.messages.build(permitted_params.except(:recipient_id))
    @message.conversation_id = @conversation.id
    @message.save!

    send_message_to_recipient

    redirect_to inbox_path
  end

  def update
    begin
      @conversation = Conversation.find(permitted_update_params[:id])
      @message = @conversation.messages.last
      @message.unread = false
      @message.save!
    rescue Exception => e
      message = e.message
      status = :unprocessable_entity

      render json: { message: message }, status: status
    end
  end

  private

  def message_params
    params.require(:message).permit(:body)
  end

  private

  def send_message_to_recipient
    UserMailer.new_message(@recipient, @current_user, @message).deliver_later
  end

  def find_conversation!
    if params[:recipient_id]
      @recipient = User.find_by(url_slug: params[:recipient_id])
      redirect_to(root_path) and return unless @recipient
      @conversation = Conversation.between(current_user.id, @recipient.id)[0]
    else
      @conversation = Conversation.find_by(id: params[:conversation_id])
      redirect_to(root_path) and return unless @conversation && @conversation.participates?(current_user)
    end
  end

  def permitted_params
    params.permit(
        :body,
        :subject,
        :recipient_id,
    )
  end

  def permitted_update_params
    params.permit(:id)
  end
end
