# frozen_string_literal: true

module BlockContent
  def self.render(content)
    contents = Array.wrap(content)
    contents.map do |content|
      renderer = "BlockContent::#{content["_type"].camelize}".constantize
      renderer.new(content).render
    end
  end
end
