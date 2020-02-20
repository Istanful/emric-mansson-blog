# frozen_string_literal: true

class Style::Normal
  include ActionView::Helpers::TagHelper

  attr_reader :children

  def initialize(children)
    @children = children
  end

  def render
    content_tag :p, children, class: 'text-gray-800 mb-5 leading-relaxed'
  end
end
