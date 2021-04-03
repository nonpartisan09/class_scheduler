class Availability < ApplicationRecord
  belongs_to :user

  validates :start_time, :end_time, :day, presence: true
  validates :user_id, presence: true

  scope :in_range, -> range {
    where('(start_time BETWEEN ? AND ?)', range.first, range.last)
  }
  scope :timed_out, -> { joins(:user).where("users.timeout=true") }
  scope :not_timed_out, -> { joins(:user).where("users.timeout=false") }


  def start_in_time_zone
    self.start_time.in_time_zone(self.timezone).strftime("%R")
  end

  def end_in_time_zone
    self.end_time.in_time_zone(self.timezone).strftime("%R")
  end

  def timezone
    user.timezone
  end
end
