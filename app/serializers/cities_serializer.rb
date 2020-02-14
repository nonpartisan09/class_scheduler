class CitiesSerializer < ActiveModel::Serializer
  attributes :type, :features

  def type
    return "FeatureCollection"
  end

  def features
    object.map do |city|
      print '****'
      print "this is object, #{object}"
      print'***'
      CitySerializer.new(city)
    end
  end

end