require_relative "../fixtures/posts_response"
require 'ostruct'

class MockSanityRuby
  def self.query(*_args)
    POSTS_RESPONSE
  end
end
