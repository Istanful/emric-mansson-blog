# frozen_string_literal: true

class PortableText::Mark::Em
  include PortableText::Mark

  def render
    content_tag :em, content
  end
end
