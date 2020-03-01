# frozen_string_literal: true

class PortableText::Style::H3
  include PortableText::Style

  def render
    content_tag :h3, children, id: text_id
  end
end
