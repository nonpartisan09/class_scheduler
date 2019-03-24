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
          message = I18n.t('custom_errors.messages.email_in_use')
          raise Users::Errors::AlreadyUsedEmail, message
        end

        if check_t_and_c_unticked?
          message = I18n.t('custom_errors.messages.agree_to_terms_and_conditions')
          raise Users::Errors::AcceptTermsAndConditions, message
        end

      end

      def execute
        @user.terms_and_conditions = TermsAndConditions.last.id
        role = Role.find(@role_id)
        @user.roles << role
        @user.active = role.url_slug != 'volunteer'

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
        if @user.volunteer?
          UserMailer.volunteer_welcome_email(@user).deliver_later
        elsif @user.client?
          UserMailer.client_welcome_email(@user).deliver_later
        end
      end

      def check_t_and_c_unticked?
        @user.terms_and_conditions = false
      end

      def check_if_email_exists?
        User.where(:email => @user.email).exists?
      end

    end
  end
end
