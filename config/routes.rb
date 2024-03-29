Rails.application.routes.draw do
  mount LetterOpenerWeb::Engine, at: '/letter_opener' if Rails.env.development?
  mount Sidekiq::Web => '/admin/sidekiq'

  root to: 'web/boards#show'

  scope module: :web do
    resource :board, only: :show
    resources :developers, only: [:new, :create]
    resource :password, only: [:new, :edit]
    resource :password_resets, only: [:create, :update]
    resource :session, only: [:new, :create, :destroy]
  end

  namespace :admin do
    resources :users
  end

  namespace :api do
    namespace :v1 do
      resources :tasks, only: [:index, :show, :create, :update, :destroy] do
        member do
          put 'attach_image'
          put 'remove_image'
        end
      end
      resources :users, only: [:index, :show]
    end
  end
end
