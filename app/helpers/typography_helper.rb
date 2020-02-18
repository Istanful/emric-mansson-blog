# frozen_string_literal: true

module TypographyHelper
  def heading_1(text)
    content_tag :h1, text, class: 'text-gray-900 text-4xl mb-3'
  end

  def paragraph(text = '', &block)
    classes = 'text-gray-800 mb-5 leading-relaxed'
    content_tag :p, class: classes do
      next block.call if block_given?

      text
    end
  end
end
