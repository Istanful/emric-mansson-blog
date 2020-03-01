# frozen_string_literal: true

class PortableText::Style::H2
  include PortableText::Style

  def render
    content_tag :h2, children, id: text_id
  end
end
