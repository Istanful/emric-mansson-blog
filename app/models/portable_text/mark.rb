# frozen_string_literal: true

module PortableText::Mark
  include ActionView::Helpers::TagHelper
  include ActionView::Helpers::OutputSafetyHelper

  attr_reader :content
  attr_reader :definition

  def initialize(content, definition = nil)
    @content = content
    @definition = definition
  end

  def self.render(mark, content, mark_defs)
    definition = mark_defs.find { |j| j["_key"] == mark } || { "_type" => mark }
    key = definition["_type"]
    renderer = "PortableText::Mark::#{key.underscore.camelize}".constantize
    renderer.new(content, definition).render
  end
end
