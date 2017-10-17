class UserDecorator
  attr_reader :user

  def initialize(user)
    @user = user
  end

  def decorate
    attributes.merge({ :student => student, :teacher => teacher })
  end

  def attributes
    @user.attributes.select { |key,v| allowed_attributes.include?(key) }
  end

  def allowed_attributes
    [ 'first_name', 'display_name', 'id' ]
  end

  def student
    @user.student?
  end

  def teacher
    @user.volunteer?
  end
end
