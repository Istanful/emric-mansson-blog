Rails.application.config.to_prepare do
  SanityRuby.configure do |config|
    config.project_id = 'svs9bwgm'
    if Rails.env.production?
      config.dataset = 'production'
    else
      config.dataset = 'test'
    end
  end
end
