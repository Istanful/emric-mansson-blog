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
    BlockContent.render(children, mark_defs)
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
