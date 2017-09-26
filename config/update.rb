module Contexts
  module Users
    class Update
      def initialize(user)
        @user = user
      end

      def execute(new_attributes)

        if new_attributes[:terms_and_conditions] == false
          new_attributes = new_attributes.except(:terms_and_conditions)
        end

        @user.update_attributes(new_attributes)
      end
    end
  end
end
