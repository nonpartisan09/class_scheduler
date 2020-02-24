# frozen_string_literal: true

namespace :users do
  desc 'For any users with city value and no lat/long, try to get a lat/long'
  # to run: rake users:assign_coordinates
  task assign_coordinates: :environment do
    # for each user without a lat/long
    User.where(latitude: nil, longitude: nil).each do |user|
      puts "User missing coordinates: #{user[:email]}"
      # if there is a city value, trick geocode into looking it up again.
      user.update(city: user[:city]) unless user[:city].blank?
    end
  end
end
