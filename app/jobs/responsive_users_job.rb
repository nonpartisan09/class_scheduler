class ResponsiveUsersJob < ApplicationJob
    queue_as :default

    def perform()
        Thread.new do
            User.all_responsive?
            ResponsiveUsersJob.set(wait_until: Date.tomorrow.midnight).perform_later
        end
    end
end 