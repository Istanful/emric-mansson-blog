# frozen_string_literal: true

class BlockContent::Code
  include BlockContent::Base

  def render
    content_tag :pre, content["code"]
  end
end
