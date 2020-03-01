# frozen_string_literal: true

module PortableText::Style
  include ActionView::Helpers::TagHelper
  include ActionView::Helpers::OutputSafetyHelper

  attr_reader :children

  def initialize(children)
    @children = children
  end

  def render
    ""
  end

  private

  def text_id
    Nokogiri::HTML(children).content
                            .downcase
                            .split(/\s/)
                            .join('-')
  end
end
