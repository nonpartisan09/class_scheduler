class Api::ApiController < ApplicationController
  include HasJsonErrors

  before_action :authenticate_user!

  respond_to :json

  def self.convert_empty_arrays(params)
    params.each_value do |value|
      case value
        when Array
          value.grep(Hash) { |hash| convert_empty_arrays(hash) }
        when Hash
          convert_empty_arrays(value)
      else
        value
      end
    end

    keys = params.keys.find_all { |k| params[k] == ['null'] }
    keys.each { |k| params[k] = [] }
    params
  end
end
