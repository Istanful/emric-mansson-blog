module SimpleHttp
  class Options
    DEFAULT_HEADERS = {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }.freeze

    attr_reader :options_hash

    def initialize(options_hash = {})
      @options_hash = options_hash
    end

    def headers
      options_hash.fetch(:headers, DEFAULT_HEADERS)
    end

    def parser
      options_hash.fetch(:parser, Parsers::JSON)
    end

    def query
      URI.encode_www_form(options_hash.fetch(:query, {}))
    end

    def body
      options_hash.fetch(:body, "")
    end
  end
end
