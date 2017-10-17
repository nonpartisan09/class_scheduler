module Contexts
  module Users
    class Creation
      def initialize(user, resource_name, role_id)
        @user = user
        @resource_name = resource_name

        if check_if_email_exists? && check_if_display_name_exists?
          raise Users::Errors::AlreadyUsedEmailAlreadyUsedDisplayName, 'This email and username are already in use. Have you forgotten your password?'
        end

        if check_if_email_exists?
          raise Users::Errors::AlreadyUsedEmail,'This email is already in use. Have you forgotten your password?'
        end

        if check_if_display_name_exists?
          raise Users::Errors::AlreadyUsedDisplayName, 'This username is already used.'
        end

      end

      def execute
        #TODO make this value dynamic once active admin is up
        @user.terms_and_conditions = TermsAndConditions.last.id
        @user.roles << Role.find(@role_id)
        @user.save

        yield @user if block_given?
        @user
      end

      private

      def check_t_and_c_unticked?
        @user.terms_and_conditions == 0
      end

      def check_if_email_exists?
        User.where(:email => @user.email).exists?
      end

      def check_if_display_name_exists?
        User.where(:display_name => @user.display_name).exists?
      end

    end
  end
end
