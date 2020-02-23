# frozen_string_literal: true

class PortableText::Style::Blockquote
  include PortableText::Style

  def render
    content_tag :blockquote, children
  end
end
