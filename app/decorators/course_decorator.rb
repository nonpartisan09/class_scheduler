class CourseDecorator < ApplicationDecorator
  delegate :id, :name, :description
end
