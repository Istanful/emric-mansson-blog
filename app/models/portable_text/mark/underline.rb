# frozen_string_literal: true

class PortableText::Mark::Underline
  include PortableText::Mark

  def render
    content_tag :u, content
  end
end
