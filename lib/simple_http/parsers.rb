module SimpleHttp
  module Parsers
    class JSON
      class << self
        def encode(raw)
          ::JSON.dump(raw)
        end

        def decode(raw)
          ::JSON.parse(raw)
        end
      end
    end
  end
end
