# frozen_string_literal: true

module BlockContent::Base
  include ActionView::Helpers::TagHelper
  include ActionView::Helpers::OutputSafetyHelper

  attr_reader :previous_renderers, :content, :mark_defs

  def initialize(previous_renderers, content, mark_defs)
    @previous_renderers = previous_renderers
    @content = content
    @mark_defs = mark_defs
  end

  def list_item
    content["listItem"]
  end

  def level
    content["level"]
  end
end
