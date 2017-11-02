Rails.application.routes.draw do
  root 'application#index'
  get 'terms_and_conditions' => 'application#t_and_c'

  resources :availabilities
  resources :courses
  resources :sessions
  resource :users

  get 'search' => 'availabilities#search'
  get 'results' => 'availabilities#results'
  get 'my_profile', to: 'user_profiles#show'

  # needed for devise
  devise_scope :user do
    get 'sign_in', to: 'sessions#new'
    delete 'sign_out', to: 'sessions#destroy'
    post 'sign_in' => 'sessions#create'
    get 'sign_up/:role', to:'registrations#new'
    post 'sign_up/:role' => 'registrations#create'
    put 'update' => 'registrations#update'
    get 'profiles/:url_slug' => 'users#show'
  end

  devise_for :users,
      only: [:sessions, :registrations, :passwords],
      singular: :user

end
