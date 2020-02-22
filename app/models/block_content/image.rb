# frozen_string_literal: true

class BlockContent::Image
  include BlockContent::Base

  def render
    content_tag :span, content["text"]
  end
end
