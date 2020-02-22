# frozen_string_literal: true

module BlockContent
  def self.render(content, mark_defs)
    contents = Array.wrap(content)
    contents.map do |content|
      renderer = "BlockContent::#{content["_type"].camelize}".constantize
      renderer.new(content, mark_defs).render
    end
  end
end
