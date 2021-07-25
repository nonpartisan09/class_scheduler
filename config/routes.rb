# frozen_string_literal: true

Rails.application.routes.draw do
  devise_for :users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)

  scope '(:locale)', locale: /en|es/ do
    root 'application#index'
    get 'terms_of_use' => 'application#t_and_c'
    get 'about' => 'application#about_page'
    get 'faq' => 'application#faq_page'
    get 'volunteer_sign_up_completed' => 'application#volunteer_sign_up_completed_page'
    get '/sitemap.xml' => 'application#sitemap', :defaults => { format: 'xml' }
    get '/robots.txt' => 'application#robots', :defaults => { format: 'plain' }

    resources :availabilities
    resources :conversations, only: %i[new create]
    resources :messages, only: %i[new create]
    resources :reviews, only: %i[create update destroy]
    resources :sessions
    resource :users do
      get 'cities', on: :collection
    end

    get 'reviews', to: 'reviews#index'

    put 'conversation', to: 'conversations#update'
    put 'message', to: 'messages#update'
    get 'reviews/author/:url_slug', to: 'reviews#author_index'
    get 'inbox', to: 'conversations#index'
    get 'inbox/:id', to: 'conversations#show'
    get 'availabilities/new' => 'availabilities#new'
    get 'search' => 'availabilities#search'
    get 'results' => 'results#index'
    get 'volunteers', to: 'results#show'
    get 'my_profile', to: 'user_profiles#show'
    get 'messages/:id', to: 'messages#update'
    post 'update_user_timeout', to: 'users#check_responses'

    # needed for devise
    devise_scope :user do
      get 'sign_in', to: 'sessions#new', as: :login
      delete 'sign_out', to: 'sessions#destroy'
      post 'sign_in', to: 'sessions#create'
      get 'password/edit' => 'passwords#edit'
      get 'password/new' => 'passwords#new'
      post 'password' => 'passwords#create'
      put 'password' => 'passwords#update'
      get 'sign_up/:role', to: 'registrations#new', as: :sign_up
      post 'sign_up/:role' => 'registrations#create'
      post 'update', to: 'registrations#update'
      get 'profiles/:url_slug', to: 'users#show'
    end

    devise_for :users,
               only: %i[registrations passwords availabilities],
               singular: :user
  end
  match '*path', to: 'application#not_found', via: :all
end
