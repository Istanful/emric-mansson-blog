# frozen_string_literal: true

require 'rails_helper'

RSpec.describe PortableText::Mark do
  describe '.render' do
    context 'when given a standard mark' do
      it 'renders that standard mark' do
        content = "Hello"
        mark = "em"
        mark_defs = []

        result = described_class.render(mark, content, mark_defs)

        expected = <<~HTML.squish
          <em>Hello</em>
        HTML
        expect(result).to eq(expected)
      end
    end

    context 'when given a mark definition' do
      it 'renders that mark' do
        content = "Hello"
        mark = "abc"
        mark_defs = [
          {
            "_key" => "abc",
            "_type" => "link",
            "href" => "/bar"
          }
        ]

        result = described_class.render(mark, content, mark_defs)

        expected = <<~HTML.squish
          <a href="/bar">Hello</a>
        HTML
        expect(result).to eq(expected)
      end
    end
  end
end
