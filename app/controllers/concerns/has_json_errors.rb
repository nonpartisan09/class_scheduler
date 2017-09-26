require 'active_support/concern'

module HasJsonErrors
  extend ActiveSupport::Concern

  included do
    rescue_from ActiveRecord::RecordInvalid, with: :render_invalid_record_error
    rescue_from ActiveRecord::RecordNotFound, with: :render_not_found_error

    private

    def render_invalid_record_error(exception)
      Airbrake.notify(exception)
      render_errors_for(exception.record)
    end

    def render_errors_for(resource)
      render_error_response(resource.errors.messages)
    end

    def render_error_response(errors, status = :unprocessable_entity)
      error_messages =
          if errors.kind_of?(Hash)
            errors.deep_transform_keys{|key| key.to_s.camelize(:lower)}
          else
            errors
          end

      error_messages.each do |key, value|
        error_messages[key] = value.kind_of?(Array) ? value.first : value
      end

      render_response({errors: error_messages}, status)
    end

    def render_api_error(error_options, other_options = {})
      status = error_options.fetch(:status)
      error_options.fetch(:code)

      render_response({ error: error_options.except(:status) }.merge(other_options), status)
    end

    def render_not_found_error(exception)
      render_empty_response(:not_found)
    end

    def render_empty_response(status)
      render_response({}, status)
    end

    def render_response(body, status)
      render json: body, status: status
    end

    def default_decorator_context
      { base_url: request.base_url }
    end
  end

  module ClassMethods

  end
end
