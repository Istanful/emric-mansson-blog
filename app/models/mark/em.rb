# frozen_string_literal: true

class Mark::Em
  include ActionView::Helpers::TagHelper

  attr_reader :text

  def initialize(text)
    @text = text
  end

  def render
    content_tag :em, text
  end
end
