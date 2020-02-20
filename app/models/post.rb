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
end
