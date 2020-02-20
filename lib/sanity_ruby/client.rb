module SanityRuby
  class Client
    attr_reader :configuration

    def initialize(configuration)
      @configuration = configuration
    end

    def query(dataset, query)
      url = "#{base_url}/v1/data/query/#{dataset}?query=#{query}"
      SimpleHttp.get(url)
    end

    private

    def base_url
      "https://#{configuration.project_id}.apicdn.sanity.io"
    end
  end
end
