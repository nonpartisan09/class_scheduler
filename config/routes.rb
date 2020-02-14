Rails.application.routes.draw do
  devise_for :users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)

  namespace 'api' do
    namespace 'v1'do
      resources :city
      resources :empty
    end
  end

  scope "(:locale)", locale: /en|es/ do
    root 'application#index'
    get 'terms_of_use' => 'application#t_and_c'
    get 'about' => 'application#about_page'
    get 'faq' => 'application#faq_page'
    get 'volunteer_sign_up_completed' => 'application#volunteer_sign_up_completed_page'
    get '/sitemap.xml' => 'application#sitemap', :defaults => {:format => 'xml'}


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
      get 'sign_in', to: 'sessions#new', as: :login
      delete 'sign_out', to: 'sessions#destroy'
      post 'sign_in', to: 'sessions#create'
      get 'password/edit' => 'passwords#edit'
      get 'password/new' => 'passwords#new'
      post 'password' => 'passwords#create'
      put 'password' => 'passwords#update'
      get 'sign_up/:role', to:'registrations#new', as: :sign_up
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