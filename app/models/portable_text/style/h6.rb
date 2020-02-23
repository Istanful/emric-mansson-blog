# frozen_string_literal: true

class PortableText::Style::H6
  include PortableText::Style

  def render
    content_tag :h6, children
  end
end
