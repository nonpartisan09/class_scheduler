class CitySerializer < ActiveModel::Serializer
  attributes :type, :properties, :geometry

  def type
    return "Feature"
  end

  def properties
    return{
        userCity:object.city,
        userCityCount:city_count,
        clientCount:client_count,
        volunteerCount:volunteer_count,
        totalClientCount:total_client_count,
        totalVolunteerCount:total_volunteer_count
    }
  end

  def geometry
    return {
        type: "Point",
        coordinates: [object["latitude"],object["longitude"]]
    }
  end

  def city_count
    return User.select(:city).where(city: object.city).count
  end

  def client_count
    return User.select('roles.name').joins(:roles).where("roles.name = 'Client'").where(city:object.city).count
  end

  def volunteer_count
    return User.select('roles.name').joins(:roles).where("roles.name = 'Volunteer'").where(city:object.city).count
  end

  def total_client_count
    return User.select('roles.name').joins(:roles).where("roles.name = 'Client'").count
  end

  def total_volunteer_count
    return User.select('roles.name').joins(:roles).where("roles.name = 'Volunteer'").count
  end

end