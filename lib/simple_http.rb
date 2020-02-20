module SimpleHttp
  class << self
    def perform_request(verb, uri, options = {})
      Request.new(verb, uri, Options.new(options)).perform
    end

    def get(*args)
      perform_request(:get, *args)
    end
  end
end
