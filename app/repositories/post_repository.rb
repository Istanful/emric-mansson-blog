class PostRepository
  attr_reader :client

  def initialize(client = SanityRuby)
    @client = client
  end

  def public
    query = "*[publishedAt<='#{Time.now.utc.iso8601}'] | order(publishedAt desc)"
    client.query(dataset, query)["result"]
          .map { |json| Post.new(json) }
  end

  def find_by_slug(slug)
    query = "*[slug.current=='#{slug}']{
      title,
      body,
      slug,
      publishedAt,
      'mainImageUrl': mainImage.asset->url
    }"
    json = client.query(dataset, query)["result"]
    Post.new(json[0])
  end

  private

  def dataset
    SanityRuby.configuration.dataset
  end
end
