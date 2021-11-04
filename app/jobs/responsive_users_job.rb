class ResponsiveUsersJob < ApplicationJob
    queue_as :default

    def perform()
        User.all_responsive?
    end
end 