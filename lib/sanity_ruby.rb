module SanityRuby
  class << self
    attr_accessor :configuration
  end

  class Configuration
    attr_accessor :project_id
  end

  def self.configure
    self.configuration ||= Configuration.new
    yield(configuration)
  end


  def self.query(dataset, query)
    Client.new(configuration).query(dataset, query).parsed_body.tap &method(:pp)
  end
end
