# frozen_string_literal: true

class PortableText::Style::H4
  include PortableText::Style

  def render
    content_tag :h4, children
  end
end
