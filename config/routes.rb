Rails.application.routes.draw do
  root "home#show"

  resources :posts, only: %i[index show]
end
