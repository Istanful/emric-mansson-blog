# frozen_string_literal: true

module PortableText::Child
  include ActionView::Helpers::TagHelper
  include ActionView::Helpers::OutputSafetyHelper

  attr_reader :json, :mark_defs

  def initialize(json, mark_defs)
    @json = json
    @mark_defs = mark_defs
  end

  def text
    json["text"]
  end

  def marks
    json.fetch("marks", [])
  end

  def self.render(json, mark_defs)
    renderer = "PortableText::Child::#{json["_type"].camelize}".constantize
    renderer.new(json, mark_defs).render
  end
end
