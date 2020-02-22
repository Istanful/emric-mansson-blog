# frozen_string_literal: true

class Mark::Code
  include ActionView::Helpers::TagHelper

  attr_reader :text

  def initialize(text)
    @text = text
  end

  def render
    content_tag :code, text
  end
end
