class BlockContent::Block
  include BlockContent::Base

  def render
    return "" if list_item.present?

    if previous&.list_item.present?
      return BlockContent::List.new(previous_renderers, content, mark_defs).render
    end

    style.new(rendered_children).render
  end

  private

  def previous
    previous_renderers.last
  end

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
end
