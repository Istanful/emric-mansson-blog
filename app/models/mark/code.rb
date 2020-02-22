# frozen_string_literal: true

class Mark::Code
  include ActionView::Helpers::TagHelper

  attr_reader :text

  def initialize(text)
    @text = text
  end

  def render
    content_tag :code, text, class: 'bg-gray-200 p-5 rounded-md block text-gray-700'
  end
end
