Rails.application.routes.draw do
  root "home#show"

  resources :posts, only: %i[index]

  get "posts/:slug", to: "posts#show", as: :post

  resource :not_found, only: %i[show]
end
