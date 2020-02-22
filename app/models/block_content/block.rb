class BlockContent::Block
  include BlockContent::Base

  def render
    if list_item.present?
      return BlockContent::ListItem.new(content, mark_defs).render
    end

    style.new(rendered_children).render
  end

  private

  def style
    "Style::#{content["style"].camelize}".constantize
  end

  def rendered_children
    mapped = children.map do |child|
      BlockContent.render(child, mark_defs)
    end

    safe_join mapped
  end

  def children
    content["children"]
  end

  def mark_defs
    content["markDefs"]
  end

  def list_item
    content["listItem"]
  end
end
