module Contexts
  module Users
    class Creation
      def initialize(user, resource_name, role_id, programs)
        @user = user
        @resource_name = resource_name
        @role_id = role_id
        @programs = programs

        if check_if_email_exists?
          raise Users::Errors::AlreadyUsedEmail,'This email is already in use. Have you forgotten your password?'
        end

        if check_t_and_c_unticked?
          raise Users::Errors::AcceptTermsAndConditions,'Please accept our terms and conditions.'
        end

      end

      def execute
        #TODO make this value dynamic once active admin is up
        @user.terms_and_conditions = TermsAndConditions.last.id
        @user.roles << Role.find(@role_id)

        @programs.each do |n|
          @user.programs << Program.find_by_name(n)
        end

        @user.save!

        yield @user if block_given?

        send_welcome_email

        @user
      end

      private

      def send_welcome_email
        UserMailer.welcome_email(@user).deliver_now
      end

      def check_t_and_c_unticked?
        @user.terms_and_conditions == 0
      end

      def check_if_email_exists?
        User.where(:email => @user.email).exists?
      end

    end
  end
end
