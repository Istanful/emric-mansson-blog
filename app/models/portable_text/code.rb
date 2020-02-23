# frozen_string_literal: true

class PortableText::Code
  include PortableText::Renderer

  def render
    child = content_tag :code, json["code"], class: 'language-ruby'
    content_tag :pre, child
  end
end
