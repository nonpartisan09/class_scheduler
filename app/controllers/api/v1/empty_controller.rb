module Api
  module V1
    class EmptyController < ApplicationController
      def index
        cities = User.select(:city).limit(1)
        render json: cities , serializer: EmptiesSerializer, adapter: :attributes, root: ''
      end
    end
  end
end