# frozen_string_literal: true

class BlockContent::Code
  include BlockContent::Base

  def render
    child = content_tag :code, content["code"], class: 'language-ruby'
    content_tag :pre, child, class: 'mb-5 p-5 rounded-md'
  end
end
