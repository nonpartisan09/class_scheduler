class Availability < ApplicationRecord
  has_one :timeable
  has_one :user, through: :timeable

  validates :start_time, :end_time, :day, :timezone, presence: true

  scope :in_range, -> range {
    where('(start_time BETWEEN ? AND ?)', range.first, range.last)
  }

  def start_in_time_zone
    self.start_time.in_time_zone(self.timezone).strftime("%R")
  end

  def end_in_time_zone
    self.end_time.in_time_zone(self.timezone).strftime("%R")
  end
end
