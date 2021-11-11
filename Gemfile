source 'https://rubygems.org'

ruby '~> 2.6.6'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?("/")
  "https://github.com/#{repo_name}.git"
end

# manually install the last working commit of mimemagic that rails 5.2.5 depends on
gem 'mimemagic', :git => 'git://github.com/mimemagicrb/mimemagic', :ref => 'd5ebc0cd846dcc68142622c76ad71d021768b7c2'

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '~> 5.2.5'

# Use SCSS for stylesheets
gem 'sass-rails', '~> 5.0'

gem 'activeadmin', '~> 1.3'

# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '~> 4.1', require: false

# needed for Heroku
gem 'delayed_job_active_record', '~> 4.1'

# Use React for views
gem 'webpacker', '~> 4.0'

# For automatically inlining email styling
gem 'roadie-rails', '~> 2.1'

gem 'aws-sdk', '~> 3.0', require: false

gem 'pg', '~> 1.1'

gem 'will_paginate', '~> 3.1'

gem 'delayed_job', '~> 4.1'
gem 'devise', '~> 4.6'

# geolocate users
gem 'geocoder', '~> 1.6'

# image helper
gem 'paperclip', '~> 6.1'

gem 'newrelic_rpm', '~> 6.5'

gem 'jquery-rails', '~> 4.3'

gem 'ffi', '~> 1.11'

gem 'active_model_serializers', '~> 0.10.0'

group :development, :test do
  # elastic beanstalk has a globally installed version of puma
  gem 'puma', '~> 3.12.6'

	gem 'factory_bot_rails', '~> 4.8'

  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug', '~> 11.0', platforms: [:mri, :mingw, :x64_mingw], require: false
  # Adds support for Capybara system testing and selenium driver
  gem 'capybara', '~> 3.25', require: false
  gem 'selenium-webdriver', '~> 3.142', require: false
  gem 'rspec-rails', '~> 3.8'

  gem 'awesome_print', '~> 1.8'

  # Add support for debugging in VSCode
  gem 'ruby-debug-ide', '0.7.2'
  gem 'debase', '0.2.4.1'
end

group :development do
  gem 'guard-rspec', '~> 4.7', require: false
  gem 'listen', '~> 3.1'
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring', '~> 2.1', require: false
  gem 'spring-watcher-listen', '~> 2.0'
  gem 'derailed_benchmarks', '~> 1.3', require: false
  gem 'letter_opener_web', '~> 1.3'
end

group :test do
  gem 'database_cleaner', '~> 1.7', require: false
  gem 'shoulda', '~> 3.6'
  gem 'shoulda-matchers', '~> 3.0'

## =========== STATS/ANALYTICS ==============
# Error monitoring
  gem 'airbrake', '~> 9.3'
  gem 'airbrake-ruby', '~> 4.5'

## =========== TESTING TOOLS ==============

end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]