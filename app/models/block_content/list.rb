# frozen_string_literal: true

class BlockContent::List
  include BlockContent::Base

  TAG_MAP = {
    "number" => :ol,
    "buller" => :ul
  }.freeze

  def render
    content_tag tag, safe_join(list_items)
  end

  private

  def list_items
    previous_renderers.reverse
                      .take_while { |r| r.list_item == previous.list_item }
                      .reverse
                      .map(&method(:render_list_item))
  end

  def render_list_item(renderer)
    BlockContent::ListItem.new(
      previous_renderers,
      renderer.content,
      mark_defs
    ).render
  end

  def tag
    TAG_MAP.fetch(list_item, :ul)
  end

  def previous
    previous_renderers.last
  end
end
