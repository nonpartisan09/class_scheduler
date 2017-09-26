module Api
  module V1
    class RegistrationsController < Devise::RegistrationsController
      include HasJsonErrors

      before_action :configure_permitted_parameters

      ERROR_CODES = {
          USER_ALREADY_SIGNED_IN: :USER_ALREADY_SIGNED_IN
      }

      def new
        build_resource({})
        yield resource if block_given?
        respond_with(resource, render: :new)
      end

      def create
        build_resource(sign_up_params)

        resource.save
        yield resource if block_given?
        if resource.persisted?
          if resource.active_for_authentication?
            sign_up(resource_name, resource)
            respond_with resource, location: after_sign_up_path_for(resource)
          else
            expire_data_after_sign_in!
            respond_with resource, location: after_inactive_sign_up_path_for(resource)
          end
        else
          clean_up_passwords resource
          set_minimum_password_length
          respond_with resource
        end
      end

      private

      def configure_permitted_parameters
        devise_parameter_sanitizer.permit(:sign_up, keys: [
            :display_name,
            :first_name,
            :last_name,
            :email,
            :password,
            :password_confirmation,
            :contact_permission,
            :terms_and_conditions,
            :remember_me,
            :role_id
        ])
      end

      def resource_name
        :user
      end
    end
 end
end
