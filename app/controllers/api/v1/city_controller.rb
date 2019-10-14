module Api
  module V1
    class CityController < ApplicationController
      def index
        cities = User.select(:city, :latitude, :longitude).group(:city, :latitude, :longitude)

        cities.where('city IS NULL OR latitude IS NULL OR longitude IS NULL')
            .update_all(city: "New York", latitude: 40.7127281, longitude: -74.0060152)

        render json: cities , serializer: CitiesSerializer, adapter: :attributes, root: ''
      end
    end
  end
end