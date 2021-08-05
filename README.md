# Class Scheduler Application

**Problem:** There is a strong demand from immigrants for naturalization classes
in NYC. There is also a large supply of volunteers offering to teach such
classes. The bottleneck is that connecting immigrants and volunteers is done
manually by non-profit staff, who do not have the capacity to provide
matching/scheduling services.

**Purpose:** Build a Rails app that lets clients schedule naturalization classes with
volunteers.

## Get started

- `$ bundle install`
- `$ yarn install`
- `$ bundle exec rails db:setup`
- `$ foreman start` (OR you can `bundle exec rails s` + `bin/webpack-dev-server` )

## SSL certificates

are provided by Let's Encrypt via the use of certbot on the server

## Troubleshooting
- to install the "pg" gem first run the command to set libpg-dev headers:
  ubuntu: `sudo apt-get install --reinstall libpq-dev`
  mac OS: `brew install libpq-dev`
