module Api
  module V1
    class PasswordsController < Devise::PasswordsController
      include HasJsonErrors

      def new
        self.resource = resource_class.new
        respond_with(resource, render: :new)
      end
    end
  end
end
