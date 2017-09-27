module Contexts
  module Users
    class Creation
      def initialize(user, resource_name)
        @user = user
        @resource_name = resource_name

        @errors = {}

        if check_if_email_exists? && check_if_display_name_exists? && check_terms_and_conditions?
          raise Users::Errors::MultipleErrors, 'This email and username are already in use. Have you forgotten your password? Please agree to terms and conditions.'
        end

        if check_if_email_exists? && check_terms_and_conditions?
          raise Users::Errors::MultipleErrors, 'This email is already in use. Have you forgotten your password? Please agree to terms and conditions.'
        end

        if check_if_display_name_exists? && check_terms_and_conditions?
          raise Users::Errors::MultipleErrors, 'This username is already in use. Please agree to terms and conditions.'
        end

        if check_if_email_exists? && check_if_display_name_exists?
          raise Users::Errors::AlreadyUsedDisplayNameAndEmail, 'This email and username are already in use. Have you forgotten your password?'
        end

        if check_if_email_exists?
          raise Users::Errors::AlreadyUsedDisplayNameAndEmail,'This email is already in use. Have you forgotten your password?'
        end

        if check_if_display_name_exists?
          raise Users::Errors::AlreadyUsedDisplayNameAndEmail, 'This username is already used.'
        end

        unless check_terms_and_conditions?
          raise Users::Errors::MustAgreeToTermsAndConditions, 'You must agree to terms and conditions.'
        end
      end

      def execute
        #To do make this value dynamic once active admin is up
        @user.terms_and_conditions = TermsAndConditions.last.id
        @user.save

        yield @user if block_given?
        @user
      end

      private

      def check_terms_and_conditions?
        @user.terms_and_conditions
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
