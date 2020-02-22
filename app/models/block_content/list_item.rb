# frozen_string_literal: true

class BlockContent::ListItem
  include BlockContent::Base

  def render
    content_tag :li, BlockContent.render(children, mark_defs)
  end

  private

  def children
    content["children"]
  end
end
