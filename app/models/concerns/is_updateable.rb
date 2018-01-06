require 'active_support/concern'

module IsUpdateable
  extend ActiveSupport::Concern

  included do
    def self.update(params, resource, proxy)
      has_programs(params)
      .has_languages(params)
      .has_password(params, resource, proxy)
    end

    scope :has_programs, proc { |params|
      if params[:programs].present?
        programs = params[:programs].map { |program| Program.find_by_name(program) }
        params.merge!(:programs => programs)
        self
      end
    }

    scope :has_languages, proc { |params|
      if params[:languages].present?
        languages = params[:languages].map { |language| Language.find_by_name(language) }
        params.merge!(:languages => languages)
        self
      end
    }

    scope :has_password, proc { |params, resource, proxy|
      if params[:password].present?
        proxy.call(resource, params)
      else
        params = params.except(:password, :password_confirmation, :current_password)
        resource.update_attributes(params)
      end
    }

  end

  module ClassMethods

  end
end
