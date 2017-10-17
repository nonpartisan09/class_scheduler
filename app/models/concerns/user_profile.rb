class UserProfile
  attr_reader :user

  def initialize(user)
    @user = user
  end

  def decorate
    {
      :display_name => display_name,
      :courses => courses,
      :languages => { :english => english, :spanish => spanish },
      :location => location,
      :student => student,
      :teacher => teacher
    }
  end

  def display_name
    @display_name ||= user.display_name
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

  def student
    @user.student?
  end

  def teacher
    @user.volunteer?
  end
end
