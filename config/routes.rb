Rails.application.routes.draw do
  root 'application#index'
  get 'terms_of_use' => 'application#t_and_c'

  resources :availabilities
  resources :programs
  resources :sessions
  resource :users
  resource :conversations, only: [:new, :create]
  resources :messages, only: [ :new, :create ]
  resources :reviews, only: [ :create, :show ]

  get 'inbox', to: 'conversations#index'
  get 'availabilities/new(/:sign_up)' => 'availabilities#new'
  get 'search(/:sign_up)' => 'availabilities#search'
  get 'results' => 'results#index'
  get 'available_volunteers', to: 'results#show'
  get 'my_profile', to: 'user_profiles#show'

  # needed for devise
  devise_scope :user do
    get 'password/edit' => 'passwords#edit'
    get 'password/new' => 'passwords#new'
    post 'password' => 'passwords#create'
    put 'password' => 'passwords#update'
    get 'sign_in', to: 'sessions#new'
    delete 'sign_out', to: 'sessions#destroy'
    post 'sign_in' => 'sessions#create'
    get 'sign_up/:role', to:'registrations#new'
    post 'sign_up/:role' => 'registrations#create'
    post 'update', to:'registrations#update'
    get 'profiles/:url_slug', to:'users#show'
  end

  devise_for :users,
      only: [:sessions, :registrations, :passwords, :availabilities],
      singular: :user
end
