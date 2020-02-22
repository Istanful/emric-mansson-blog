# frozen_string_literal: true

class BlockContent::Image
  include BlockContent::Base
  include ActionView::Helpers::AssetTagHelper

  def render
    image_tag SanityImageUrl.for(reference), class: 'w-full mb-5 rounded-md'
  end

  private

  def reference
    content.fetch("asset", {}).fetch("_ref", "")
  end
end
