# frozen_string_literal: true

class PortableText::Mark::Link
  include PortableText::Mark
  include ActionView::Helpers::UrlHelper

  def render
    link_to content, href
  end

  private

  def href
    definition["href"]
  end
end
