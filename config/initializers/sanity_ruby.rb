Rails.application.config.to_prepare do
  SanityRuby.configure do |config|
    config.project_id = 'svs9bwgm'
    config.dataset = 'production'
  end
end
