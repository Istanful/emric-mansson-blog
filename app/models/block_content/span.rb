# frozen_string_literal: true

class BlockContent::Span
  include BlockContent::Base

  def render
    marks.inject(text) do |acc, mark|
      if (definition = mark_definition(mark)).present?
        next MarkDefinition.render(definition, acc)
      end

      renderer = "Mark::#{mark.underscore.camelize}".constantize
      renderer.new(text).render
    end
  end

  private

  def text
    content["text"]
  end

  def marks
    content["marks"]
  end

  def mark_definition(mark)
    MarkDefs.new(mark_defs).by_key(mark)
  end
end
