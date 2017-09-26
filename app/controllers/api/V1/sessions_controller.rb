module Api
  module V1
    class SessionsController < Devise::SessionsController

      include HasJsonErrors

      def new
        super
      end

      def create
        super
      end

      def destroy
        super
      end
    end
  end
end
