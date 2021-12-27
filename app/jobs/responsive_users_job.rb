class ResponsiveUsersJob < ApplicationJob
  queue_as :default

  def perform(user_id)
    user = User.find(user_id)
    user.audit_conversations
  end
end 