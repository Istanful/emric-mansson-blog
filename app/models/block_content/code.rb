# frozen_string_literal: true

class BlockContent::Code
  include BlockContent::Base

  def render
    content_tag :pre, content["code"],
                class: 'bg-gray-800 mb-5 text-white p-5 rounded-md'
  end
end
