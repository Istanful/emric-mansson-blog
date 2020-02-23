# frozen_string_literal: true

class PortableText::ListItem
  include PortableText::Renderer

  def render
    inner_nodes = children.map do |child|
      PortableText::Child.render(child, mark_defs)
    end

    content_tag :li, safe_join([*inner_nodes, render_nested_list])
  end

  def append(child)
    return @nested_list.append(child) if @nested_list.present?

    @nested_list = PortableText::List.new([], child.json)
  end

  private

  def render_nested_list
    return "" if @nested_list.blank?

    @nested_list.render
  end
end
