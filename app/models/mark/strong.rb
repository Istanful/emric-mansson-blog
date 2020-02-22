# frozen_string_literal: true

class Mark::Strong
  include ActionView::Helpers::TagHelper

  attr_reader :text

  def initialize(text)
    @text = text
  end

  def render
    content_tag :strong, text
  end
end
