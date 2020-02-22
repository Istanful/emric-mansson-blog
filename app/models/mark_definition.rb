# frozen_string_literal: true

module MarkDefinition
  def self.render(definition, content)
    renderer = "MarkDefinition::#{definition["_type"].camelize}".constantize
    renderer.new(definition, content).render
  end
end
