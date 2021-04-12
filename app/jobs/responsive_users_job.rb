class ResponsiveUsersJob < ApplicationJob
    queue_as :default

    def perform()
        Thread.new do
            User.all_responsive?
            ResponsiveUsersJob.set(wait_until: DateTime.now + 5.minutes).perform_later
        end
    end
end 