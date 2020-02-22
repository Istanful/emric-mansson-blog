# frozen_string_literal: true

module MarkDefinition::Base
  attr_reader :definition, :content

  def initialize(definition, content)
    @definition = definition
    @content = content
  end

  def render
    ""
  end
end
