module SimpleHttp
  class Response
    attr_reader :options
    attr_reader :original_response

    def initialize(options, original_response)
      @options = options
      @original_response = original_response
    end

    def parsed_body
      options.parser.decode(original_response.body)
    end
  end
end
