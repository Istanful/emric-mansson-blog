# frozen_string_literal: true

class BlockContent::Code
  include ActionView::Helpers::TagHelper

  attr_reader :content

  def initialize(content)
    @content = content
  end

  def render
    content_tag :pre, content["code"]
  end
end
