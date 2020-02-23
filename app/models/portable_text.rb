# frozen_string_literal: true

class PortableText
  include ActionView::Helpers::OutputSafetyHelper

  attr_reader :json

  def initialize(json)
    @json = Array.wrap(json)
  end

  def to_html
    renderers = json.inject([]) do |acc, content|
      renderer = "PortableText::#{content["_type"].camelize}".constantize
      renderer.new(acc, content).next
    end

    safe_join renderers.map(&:render)
  end
end
