# frozen_string_literal: true

class PortableText::Mark::Code
  include PortableText::Mark

  def render
    content_tag :code, content
  end
end
