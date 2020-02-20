# frozen_string_literal: true

class Style::H3
  include ActionView::Helpers::TagHelper

  attr_reader :children

  def initialize(children)
    @children = children
  end

  def render
    content_tag :h3, children
  end
end
