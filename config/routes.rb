Rails.application.routes.draw do
  root 'application#index'
  get 'terms_and_conditions' => 'application#t_and_c'

  resources :availabilities
  resources :courses

  get 'search' => 'availabilities#search'
  get 'results' => 'availabilities#results'
  get 'my_profile', to: 'user_profiles#show'

  # needed for devise
  devise_scope :user do
    get 'sign_in', to: 'sessions#new'
    post 'sign_in' => 'sessions#create'
    delete 'sign_out' => 'sessions#destroy'
    get 'sign_up/:role', to:'registrations#new'
    post 'sign_up/:role' => 'registrations#create'
    get 'password' => 'passwords#new'
  end

  devise_for :users,
      only: [:sessions, :registrations, :passwords],
      singular: :user

  get '*unmatched_route' => 'application#not_found'
end
