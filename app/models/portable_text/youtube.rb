# frozen_string_literal: true

class PortableText::Youtube
  include PortableText::Renderer

  RATIO = 9 / 16.0

  def render
    iframe_classes = "w-full absolute inset-0 h-full"
    iframe = content_tag :iframe, '', src: json["url"], class: iframe_classes
    content_tag :div,
                iframe,
                style: "padding-bottom: #{RATIO * 100}%",
                class: 'relative youtube'
  end
end
