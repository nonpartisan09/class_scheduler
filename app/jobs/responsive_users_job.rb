class ResponsiveUsersJob < ApplicationJob
    queue_as :default

    def perform()
        User.all_responsive?
        ResponsiveUsersJob.set(wait_until: DateTime.now + 5.minutes).perform_now
    end
end 