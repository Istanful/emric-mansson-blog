class PostRepository
  attr_reader :client

  def initialize(client = SanityRuby)
    @client = client
  end

  def public
    client.query('production', '*[_type=="post"]')["result"]
          .map { |json| Post.new(json) }
  end
end
