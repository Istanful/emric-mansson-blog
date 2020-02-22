# frozen_string_literal: true

class Post
  attr_reader :json

  def initialize(json)
    @json = json
  end

  def title
    json["title"]
  end

  def introduction_text
    json["body"].select { |b| b["style"] == "normal" }
                .first
  end

  def id
    json["_id"]
  end

  def slug
    json.fetch("slug", {}).fetch("current", "")
  end

  def body
    json["body"]
  end

  def mainImageUrl
    json["mainImageUrl"]
  end
end
