require 'roar/json/json_api'

module Api
  module V1
    class UserDecorator < ::Roar::Decorator
      include RelativeDatetimeFormatter
      include Roar::JSON::JSONAPI.resource :users

      attributes do
        :url_slug
        :display_name
      end

      def created_at
        relative_datetime(object.created_at)
      end

    end
  end
end
