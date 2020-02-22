# frozen_string_literal: true

module BlockContent
  class << self
    include ActionView::Helpers::OutputSafetyHelper

    def render(content, mark_defs)
      contents = Array.wrap(content)
      renderers = contents.inject([]) do |acc, content|
        renderer = "BlockContent::#{content["_type"].camelize}".constantize
        [*acc, renderer.new(acc, content, mark_defs)]
      end

      safe_join renderers.map(&:render)
    end
  end
end
