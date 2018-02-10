Rails.application.routes.draw do
  devise_for :users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)

  scope "(:locale)", locale: /en|es/ do
    root 'application#index'
    get 'terms_of_use' => 'application#t_and_c'
    get 'about' => 'application#about_page'

    resources :availabilities
    resources :conversations, only: [ :new, :create ]
    resources :messages, only: [ :new, :create ]
    resources :reviews, only: [ :create, :update, :destroy ]
    resources :sessions
    resource :users

    get 'reviews', to: 'reviews#index'

    put 'conversation', to: 'conversations#update'
    get 'reviews/author/:url_slug', to: 'reviews#author_index'
    get 'inbox', to: 'conversations#index'
    get 'inbox/:id', to: 'conversations#show'
    get 'availabilities/new' => 'availabilities#new'
    get 'search' => 'availabilities#search'
    get 'results' => 'results#index'
    get 'volunteers', to: 'results#show'
    get 'my_profile', to: 'user_profiles#show'
    get 'messages/:id', to: 'messages#update'

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
        only: [ :registrations, :passwords, :availabilities],
        singular: :user

  end
  match "*path", to: "application#not_found", via: :all
end
