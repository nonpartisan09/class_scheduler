include ActionView::Helpers::DateHelper

class UserDecorator < ApplicationDecorator
  delegate :first_name, :id, :student, :teacher, :city, :last_sign_in_at, :courses

  decorates_association :courses

  def last_sign_in_at
    time_ago_in_words(object.last_sign_in_at)
  end

  def teacher
    object.volunteer?
  end

  def student
    object.student?
  end

  def courses
    CourseDecorator.decorate_collection(object.courses)
  end
end
