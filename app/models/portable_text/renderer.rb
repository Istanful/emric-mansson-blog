# frozen_string_literal: true

module PortableText::Renderer
  include ActionView::Helpers::TagHelper
  include ActionView::Helpers::OutputSafetyHelper

  attr_reader :renderers
  attr_reader :json

  def initialize(renderers, json)
    @renderers = renderers
    @json = json
  end

  def next
    [*renderers]
  end

  def render
    ""
  end

  def level
    json.fetch("level", 1)
  end

  private

  def children
    json["children"]
  end

  def mark_defs
    json.fetch("markDefs", [])
  end

  def list_item
    json["listItem"]
  end
end
