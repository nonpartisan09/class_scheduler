require 'active_support/concern'

module ActsAsMessageable
  extend ActiveSupport::Concern

  included do
    has_many :authored_conversations, class_name: 'Conversation', foreign_key: 'author_id'
    has_many :received_conversations, class_name: 'Conversation', foreign_key: 'recipient_id'
    has_many :messages, dependent: :destroy
  end

  module ClassMethods

  end
end
