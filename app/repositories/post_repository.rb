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
    query = "*[slug.current=='#{slug}']{
      title,body,'mainImageUrl': mainImage.asset->url
    }"
    json = client.query('production', query)["result"]
    Post.new(json[0])
  end
end
