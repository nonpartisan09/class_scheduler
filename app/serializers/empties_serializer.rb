class EmptiesSerializer < ActiveModel::Serializer
  attributes :type, :features

  def type
    return "FeatureCollection"
  end

  def features
    object.map do |city|
      EmptySerializer.new(city)
    end
  end

end