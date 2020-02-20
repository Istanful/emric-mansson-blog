# frozen_string_literal: true

class BlockContent::Span
  include ActionView::Helpers::TagHelper

  attr_reader :content

  def initialize(content)
    @content = content
  end

  def render
    content_tag :span, content["text"]
  end
end
