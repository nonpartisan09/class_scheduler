Rails.application.routes.draw do

	namespace :api, defaults: {format: :json} do 
	  resources :tutors
	  resources :students
	  devise_for :users
	end
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root to: "pages#home"
end
