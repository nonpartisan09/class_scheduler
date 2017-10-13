Rails.application.routes.draw do
  root 'application#index'
  get 'terms_and_conditions' => 'application#t_and_c'

  resources :availabilities
  resources :courses

  devise_for :users,
      only: [:sessions, :registrations, :passwords],
      singular: :user

  get 'search' => 'availabilities#search'
  get 'results' => 'availabilities#results'

  # needed for devise
  devise_scope :user do
    get 'sign_in' => 'sessions#new'
    post 'sign_in' => 'sessions#create'
    delete 'sign_out' => 'sessions#destroy'
    get 'sign_up/:role' => 'registrations#new', :as => "sign_up"
    post 'sign_up/:role' => 'registrations#create'
    get 'password' => 'passwords#new'
    get 'my_profile' => 'user_profiles#show'
  end

  get '*unmatched_route' => 'application#not_found'
end
