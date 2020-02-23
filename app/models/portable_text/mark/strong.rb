# frozen_string_literal: true

class PortableText::Mark::Strong
  include PortableText::Mark

  def render
    content_tag :strong, content
  end
end
