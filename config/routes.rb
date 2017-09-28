Rails.application.routes.draw do
  root 'application#index'
  get 'terms_and_conditions' => 'application#t_and_c'

  resources :english_classes
  resources :users

  # needed for devise
  devise_scope :user do
    get 'session' => 'sessions#show'
    get 'sign_in' => 'sessions#new'
    post 'sign_in' => 'sessions#create'
    delete 'sign_out' => 'sessions#destroy'
    get 'sign_up/:role' => 'registrations#new', :as => "sign_up"
    post 'registrations' => 'registrations#create'
    get 'password' => 'passwords#new'
  end

  devise_for :users,
    only: [:sessions, :registrations, :passwords],
    singular: :user

  get '*unmatched_route' => 'application#not_found'
end
