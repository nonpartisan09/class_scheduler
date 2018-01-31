source 'https://rubygems.org'

ruby '2.3.4'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?("/")
  "https://github.com/#{repo_name}.git"
end

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '~> 5.1', require: false

# Use SCSS for stylesheets
gem 'sass-rails', '~> 5.0'

gem 'activeadmin', '~> 1.2.1'

# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '~> 3.2', require: false

# needed for Heroku
gem 'delayed_job_active_record'

# Use React for views
gem 'webpacker', '~> 3.0'

# For automatically inlining email styling
gem 'roadie-rails', '~>1.2.1'

gem 'actionpack-action_caching'

# Turbolinks makes navigating your web application faster. Read more: https://github.com/turbolinks/turbolinks
#gem 'turbolinks', '~> 5'

gem 'aws-sdk', '~> 2.10', require: false

gem 'pg', '~> 0.21.0'

gem 'will_paginate'

gem 'delayed_job', '~> 4.1'
gem 'devise', '~> 4.3'

# geolocate users
gem 'geocoder', '~> 1.4'

# image helper
gem 'paperclip', '5.1'

gem 'factory_girl_rails', '~> 4.9'

group :production do
  gem 'unicorn', '~> 5.4.0'
end

gem 'jquery-rails', '~> 4.3.1'
group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug', '~> 9.1', platforms: [:mri, :mingw, :x64_mingw], require: false
  # Adds support for Capybara system testing and selenium driver
  gem 'capybara', '~> 2.13', require: false
  gem 'selenium-webdriver', '~> 3.7', require: false
  gem 'rspec-rails', '~> 3.6'

  # Use mysql as the database for Active Record
  gem 'mysql2', '>= 0.3.18', '< 0.5', require: false

  gem 'awesome_print'
end

group :development do
  gem 'gem_bench', :require => false, :group => :development
  gem 'guard-rspec', require: false
  # Access an IRB console on exception pages or by using <%= console %> anywhere in the code.
  gem 'web-console', '>= 3.3.0'
  gem 'listen', '~> 3.1', require: false
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring', '~> 2.0', require: false
  gem 'spring-watcher-listen', '~> 2.0.0'
  gem 'derailed_benchmarks', '~> 1.3', require: false
  gem 'letter_opener_web', '~> 1.3'
end

group :test do
  gem 'database_cleaner', '~> 1.6', require: false
  gem 'shoulda'
  gem 'shoulda-matchers', '~> 2.8', require: false
  gem 'capybara-webkit', '~> 1.14', require: false

## =========== STATS/ANALYTICS ==============
# Error monitoring
  gem 'airbrake'
  gem 'airbrake-ruby'

## =========== TESTING TOOLS ==============

end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
