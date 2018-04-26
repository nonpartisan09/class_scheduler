# Class Scheduler Application

**Problem:** There is a strong demand from immigrants for naturalization classes
in NYC. There is also a large supply of volunteers offering to teach such
classes. The bottleneck is that connecting immigrants and volunteers is done
manually by non-profit staff, who do not have the capacity to provide
matching/scheduling services.

**Purpose:** Build a Rails app that lets clients schedule naturalization classes with
volunteers.

## Minimum Viable Product

- Multilingual pages

- Authentication
	- Client / Volunteer Sign-up && Login

- Scheduling
	- Volunteers can create class sessions
	- Clients can search for class sessions by location, date, and language
	- Clients and volunteers can communicate

- Credibility/Safety
	- Non-anonymous volunteer accounts
	- Clients and volunteers can review each other
	- Legal Disclaimer

- Mobile first design

- Cost
	- Free to use
	- Free/Cheap to maintain

- Admin view
	- view Client-Tutor connections
	- view / delete accounts

## Views

Meta:
- `/`

User Authentication:
- `sign_up/client`
- `sign_up/volunteer`
- `sign_in`

Scheduling:
- `search`: index page for clients to search for class sessions
- `availabilities/new`: show/edit page for volunteers to create/edit schedules

## Models

- `User`
- `Role`
- `Availability`
- `Program`

## Libraries

- `moment`
- `react-joi-validation`
- `joi-browser`
- `material-ui`

## Get started

- `$ bundle install`
- `$ yarn install`
- `$ rake db:create RAILS_ENV=development`
- `$ rake db:migrate RAILS_ENV=development`
- `$ rake db:seed`
- `$ rake assets:precompile`
- `$ foreman start`

## Troubleshooting

When deploying to Amazon, if node garbage collection leaks and you get a V8:
- restart the app
- deploy latest stable version
- try again

## SSL certificates

are provided by Let's Encrypt via the use of certbot on the server

## IMPORTANT

Do not deploy master to staging
Staging does not have the certificates set up by bash scripts on master
The app will crash
