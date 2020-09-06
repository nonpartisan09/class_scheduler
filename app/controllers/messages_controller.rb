class MessagesController < ApplicationController
  before_action :authenticate_user!
  before_action :find_conversation!, except: [ :update ]

  def new
    @message = current_user.messages.build
    @user = UserDecorator.new(current_user).simple_decorate
    @data = { :message => @message, :currentUser => @user }
  end

  def create
    if !@conversation 
      @conversation = Conversation.create(author_id: current_user.id, recipient_id: @recipient.id)
      program = current_user.programs.first
      timely_response_job = TimelyResponseJob.new(@conversation, @recipient, current_user, program)
      Delayed::Job.enqueue(timely_response_job, 0, 2.days.from_now)
    end
    @message = current_user.messages.build(permitted_params.except(:recipient_id))
    @message.conversation_id = @conversation.id
    @message.unread = true
    @message.save!

    send_message_to_recipient

    redirect_to inbox_path
  end

  def update
    begin
      @message = Message.find(permitted_update_params[:id])
      @message.unread = false
      @message.save!
      render json: { :message => @message }
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
    UserMailer.new_message(@recipient, @current_user, @message).deliver_later if @recipient.email_notification
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
