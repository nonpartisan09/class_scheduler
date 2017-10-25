class UserProfile
  attr_reader :user

  def initialize(user)
    @user = user
    @address = 'No address provided'
  end

  def decorate
    {
      :courses => courses,
      :address => address,
      :city => city,
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

  def address
    user.address ||= @address
  end

  def city
    @city || user.city
  end

  def student
    @user.student?
  end

  def teacher
    @user.volunteer?
  end
end
