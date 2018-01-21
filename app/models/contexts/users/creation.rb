module Contexts
  module Users
    class Creation
      def initialize(user, resource_name, role_id, programs, languages)
        @user = user
        @resource_name = resource_name
        @role_id = role_id
        @programs = programs
        @languages = languages

        if check_if_email_exists?
          raise Users::Errors::AlreadyUsedEmail,'This email is already in use. Have you forgotten your password?'
        end

        if check_t_and_c_unticked?
          raise Users::Errors::AcceptTermsAndConditions,'Please accept our terms and conditions.'
        end

      end

      def execute
        @user.terms_and_conditions = TermsAndConditions.last.id
        @user.roles << Role.find(@role_id)

        build_programs

        build_languages

        @user.save!

        yield @user if block_given?

        send_welcome_email

        @user
      end

      private

      def build_programs
        @programs.each do |program|
          @user.programs << Program.find_by_name(program)
        end
      end

      def build_languages
        @languages.each do |language|
          @user.languages << Language.find_by_name(language)
        end
      end

      def send_welcome_email
        UserMailer.welcome_email(@user).deliver_later
      end

      def check_t_and_c_unticked?
        !@user.terms_and_conditions
      end

      def check_if_email_exists?
        User.where(:email => @user.email).exists?
      end

    end
  end
end
