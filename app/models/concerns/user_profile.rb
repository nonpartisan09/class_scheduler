class UserProfile
  attr_reader :user

  def initialize(user)
    @user = user
    @address = 'No address provided'
  end

  def decorate
    {
      :courses => courses,
      :languages => { :english => english, :spanish => spanish },
      :address => address,
      :student => student,
      :teacher => teacher,
      :email => email,
      :first_name => first_name
    }
  end

  def first_name
    @first_name ||= user.first_name
  end

  def email
    @email ||= user.email
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

  def address
    @address ||= user.address
  end

  def student
    @user.student?
  end

  def teacher
    @user.volunteer?
  end
end
