Rails.application.routes.draw do
  root 'application#index'
  resources :english_classes

  namespace 'api' do
    # V1 API ==========================================
    namespace 'v1' do
      resources :users

      # needed for devise
      devise_scope :user do
        get "session" => "sessions#show"
        get "sign_in" => "sessions#new"
        delete 'sign_out' => 'sessions#destroy'
        get "sign_up" => "registrations#new"
        post "registrations" => 'registrations#create'
        get "password" => "passwords#new"
      end

      devise_for :users,
          only: [:sessions, :registrations, :passwords],
          singular: :user,
          password_length: 8..30
    end

  end

end
