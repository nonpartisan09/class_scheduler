Rails.application.routes.draw do
	
  root to: "pages#home"
  
	namespace :api, defaults: {format: :json} do 
	  devise_for :users, controllers: {
	  	sessions: 'api/sessions', 
	  	registrations: 'api/registrations'
	 	}  

	 	get "current_user", to: "users#current_user"

	end
	
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
