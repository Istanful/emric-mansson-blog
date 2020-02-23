class PortableText::Block
  include PortableText::Renderer

  def render
    style.new(rendered_children).render
  end

  def next
    return normal_next if list_item.blank?

    PortableText::List.new(renderers, json).next
  end

  private

  def normal_next
    [*renderers, self]
  end

  def rendered_children
    node_list = children.map do |child|
      PortableText::Child.render(child, mark_defs)
    end

    safe_join node_list
  end

  def style
    "PortableText::Style::#{json["style"].camelize}".constantize
  end
end
