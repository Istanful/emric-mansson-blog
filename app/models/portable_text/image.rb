# frozen_string_literal: true

class PortableText::Image
  include PortableText::Renderer
  include ActionView::Helpers::AssetTagHelper

  def render
    image_tag SanityImageUrl.for(reference)
  end

  private

  def reference
    json.fetch("asset", {}).fetch("_ref", "")
  end
end
