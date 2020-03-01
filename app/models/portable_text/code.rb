# frozen_string_literal: true

class PortableText::Code
  include PortableText::Renderer

  def render
    language = json["language"]
    child = content_tag :code, json["code"], class: "language-#{language}"
    content_tag :pre, child
  end
end
