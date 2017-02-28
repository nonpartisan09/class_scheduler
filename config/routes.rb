Rails.application.routes.draw do

	namespace :api, defaults: {format: :json} do 
	  resources :tutors, only: [:update, :show, :index]
	  resources :students, only: [:update, :show, :index]
	  devise_for :tutors
	  devise_for :students
	end
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root to: "pages#home"
end
