Rails.application.routes.draw do
	
  root to: "pages#home"

	namespace :api, defaults: {format: :json} do 
	  devise_for :users
	end
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
