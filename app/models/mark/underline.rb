class Mark::Underline
  include ActionView::Helpers::TagHelper

  attr_reader :text

  def initialize(text)
    @text = text
  end

  def render
    content_tag :u, text
  end
end
