module SimpleHttp
  class Request
    attr_reader :verb, :uri, :options

    def initialize(verb, uri, options)
      @verb = verb
      @uri = URI(uri)
      @options = options
    end

    def perform
      result = http.request(request)
      Response.new(options, result)
    end

    def http
      ::Net::HTTP.new(uri.host, uri.port).tap do |obj|
        obj.use_ssl = uri.scheme == 'https'
        obj.verify_mode = OpenSSL::SSL::VERIFY_PEER
      end
    end

    def request
      klass = Kernel.const_get("Net::HTTP::#{verb.capitalize}")
      klass.new(uri).tap do |request|
        set_headers(request)
        set_body(request)
        set_query(request)
      end
    end

    private

    def set_query(request)
      return if options.query.blank?

      request.uri.query ||= options.query
    end

    def set_body(request)
      return if options.body.blank?

      request.body = options.parser.encode(options.body)
    end

    def set_headers(request)
      options.headers.each do |header, value|
        request.add_field(header.to_s, value)
      end
    end
  end
end
