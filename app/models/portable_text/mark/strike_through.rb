# frozen_string_literal: true

class PortableText::Mark::StrikeThrough
  include PortableText::Mark

  def render
    content_tag :strike, content
  end
end
