class PostRepository
  attr_reader :client

  def initialize(client = SanityRuby)
    @client = client
  end

  def public
    client.query('production', '*[_type=="post"]')["result"]
          .map { |json| Post.new(json) }
  end

  def find_by_slug(slug)
    json = client.query('production', "*[slug.current=='#{slug}']")["result"][0]
    Post.new(json)
  end
end
