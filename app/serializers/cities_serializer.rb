class CitiesSerializer < ActiveModel::Serializer
  attributes :type, :features

  def type
    return "FeatureCollection"
  end

  def features
    object.map do |city|
      CitySerializer.new(city)
    end
  end

end