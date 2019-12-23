module Api
  module V1
    class CityController < ApplicationController
      def index
        cities = User.select(:city).group(:city)
            .where.not(:city => 'New York')
            .where.not(:city => nil, :latitude => nil, :longitude => nil)
        render json: cities , serializer: CitiesSerializer, adapter: :attributes, root: ''
      end
    end
  end
end