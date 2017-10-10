class UserProfile
  attr_reader :user

  def initialize(user)
    @user = user
  end

  def username
    @username ||= user.display_name
  end

  def courses
    @courses ||= user.courses
  end

  def english
    @english ||= true
  end

  def spanish
    @spanish ||= true
  end

  def location
    @location ||= "somewhere over the rainbow"
  end
end
