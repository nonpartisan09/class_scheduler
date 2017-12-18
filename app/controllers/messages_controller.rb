class MessagesController < ApplicationController
  before_action :find_conversation!, :authenticate_user!

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
end
