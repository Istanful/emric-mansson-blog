# frozen_string_literal: true

module BlockContent
  extend ActionView::Helpers::OutputSafetyHelper

  def self.render(content, mark_defs)
    contents = Array.wrap(content)
    node_list = contents.map do |content|
      renderer = "BlockContent::#{content["_type"].camelize}".constantize
      renderer.new(content, mark_defs).render
    end

    safe_join node_list
  end
end
