# frozen_string_literal: true

class PortableText::Style::Normal
  include PortableText::Style

  def render
    content_tag :p, children
  end
end
