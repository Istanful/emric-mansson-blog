# frozen_string_literal: true

class PortableText::List
  include PortableText::Renderer

  def next
    previous = renderers.last
    case previous
    when PortableText::List
      previous.append(PortableText::ListItem.new(renderers, json))
      [*renderers]
    else
      [*renderers, PortableText::List.new(renderers, json)]
    end
  end

  def render
    content_tag :ul, rendered_list_items
  end

  def append(child)
    return list_items << child if child.level == level

    list_items.last.append(child)
  end

  private

  def last_list_item
    list_items.last
  end

  def list_items
    @list_items ||= [PortableText::ListItem.new(renderers, json)]
  end

  def rendered_list_items
    node_list = list_items.map(&:render)

    safe_join node_list
  end
end
