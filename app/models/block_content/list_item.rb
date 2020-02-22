# frozen_string_literal: true

class BlockContent::ListItem
  include BlockContent::Base

  def render
    content_tag :li, rendered_children
  end

  private

  def rendered_children
    mapped = children.map do |child|
      BlockContent.render(child, mark_defs)
    end

    safe_join mapped
  end

  def children
    content["children"]
  end
end
