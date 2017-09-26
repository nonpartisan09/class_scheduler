require 'roar/json/json_api'

module Api
  module V1
    class PrivateUserDecorator < ::Roar::Decorator
      include RelativeDatetimeFormatter
      include Roar::JSON::JSONAPI.resource :users

      attributes :id, :created_at, :url_slug,
          :contact_permission, :email, :display_name, :terms_and_conditions

      def email
        object.email
      end

      def created_at
        relative_datetime(object.created_at)
      end
    end
  end
end
