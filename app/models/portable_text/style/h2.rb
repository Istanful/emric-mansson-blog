# frozen_string_literal: true

class PortableText::Style::H2
  include PortableText::Style

  def render
    content_tag :h1, children
  end
end
