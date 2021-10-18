class ResponsiveUsersJob < ApplicationJob
  queue_as :default

  def perform()
    User.audit_conversations
  end
end 