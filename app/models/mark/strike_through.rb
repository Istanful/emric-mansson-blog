# frozen_string_literal: true

class Mark::StrikeThrough
  include ActionView::Helpers::TagHelper

  attr_reader :text

  def initialize(text)
    @text = text
  end

  def render
    content_tag :strike, text
  end
end
