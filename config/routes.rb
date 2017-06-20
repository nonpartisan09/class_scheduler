Rails.application.routes.draw do
  devise_for :users
  root 'english_classes#index'
  resources :english_classes
  resources :users
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
