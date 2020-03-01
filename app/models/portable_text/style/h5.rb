# frozen_string_literal: true

class PortableText::Style::H5
  include PortableText::Style

  def render
    content_tag :h5, children, id: text_id
  end
end
