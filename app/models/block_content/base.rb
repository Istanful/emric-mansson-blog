# frozen_string_literal: true

module BlockContent::Base
  include ActionView::Helpers::TagHelper
  include ActionView::Helpers::OutputSafetyHelper

  attr_reader :content, :mark_defs

  def initialize(content, mark_defs)
    @content = content
    @mark_defs = mark_defs
  end
end
