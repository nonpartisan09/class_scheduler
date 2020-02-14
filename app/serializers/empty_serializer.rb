class EmptySerializer < ActiveModel::Serializer
  attributes :type, :properties, :geometry

  def type
    return "Feature"
  end

  def properties
    return{
        userCity: 'New York',
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
        coordinates: [ 40.730610, -73.935242]
    }
  end

  def city_count
    return User.where(:city => nil)
          .or(User.where(:city => 'New York'))
          .or(User.where(:latitude => nil))
          .or(User.where(:latitude => nil))
          .count
  end

  def client_count
    return User.select('roles.name').joins(:roles).where("roles.name = 'Client'").where(:city => nil)
           .or(User.select('roles.name').joins(:roles).where("roles.name = 'Client'").where(:city => 'New York'))
           .or(User.select('roles.name').joins(:roles).where("roles.name = 'Client'").where(:latitude => nil))
           .or(User.select('roles.name').joins(:roles).where("roles.name = 'Client'").where(:latitude => nil))
           .count
  end

  def volunteer_count
    return User.select('roles.name').joins(:roles).where("roles.name = 'Volunteer'").where(:city => nil)
           .or(User.select('roles.name').joins(:roles).where("roles.name = 'Volunteer'").where(:city => 'New York'))
           .or(User.select('roles.name').joins(:roles).where("roles.name = 'Volunteer'").where(:latitude => nil))
           .or(User.select('roles.name').joins(:roles).where("roles.name = 'Volunteer'").where(:latitude => nil))
           .count
  end

  def total_client_count
    return User.select('roles.name').joins(:roles).where("roles.name = 'Client'").count
  end

  def total_volunteer_count
    return User.select('roles.name').joins(:roles).where("roles.name = 'Volunteer'").count
  end

end