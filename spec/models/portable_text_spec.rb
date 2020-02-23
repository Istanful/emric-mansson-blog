# frozen_string_literal: true

require 'rails_helper'

RSpec.describe PortableText do
  describe '#to_html' do
    it 'renders normal blocks' do
      json = {
        "style" => "normal",
        "_type" => "block",
        "children" => [
          {
            "_type" => "span",
            "text" => "Some text"
          }
        ]
      }

      result = render(json)

      expected = <<~HTML.squish
        <p>Some text</p>
      HTML

      expect(result).to eql(expected)
    end

    it 'renders styled blocks' do
      json = {
        "style" => "h1",
        "_type" => "block",
        "children" => [
          {
            "_type" => "span",
            "text" => "Some text"
          }
        ]
      }

      result = render(json)

      expected = <<~HTML.squish
        <h1>Some text</h1>
      HTML

      expect(result).to eql(expected)
    end

    it 'respects mark defs' do
      json = {
        "style" => "normal",
        "_type" => "block",
        "children" => [
          {
            "_type" => "span",
            "marks" => ["bdd6b0c72b57"],
            "text" => "Rick roll"
          }
        ],
        "markDefs" => [
          {
            "_key"=> "bdd6b0c72b57",
            "_type"=> "link",
            "href"=> "/rick-roll"
          }
        ],
      }

      result = render(json)

      expected = <<~HTML.squish
        <p><a href="/rick-roll">Rick roll</a></p>
      HTML

      expect(result).to eql(expected)
    end

    it 'renders lists' do
      json = [
        {
          "style" => "normal",
          "_type" => "block",
          "listItem" => "bullet",
          "children" => [
            {
              "_type" => "span",
              "marks" => [],
              "text" => "One"
            }
          ],
        },
        {
          "style" => "normal",
          "_type" => "block",
          "listItem" => "bullet",
          "children" => [
            {
              "_type" => "span",
              "marks" => [],
              "text" => "Two"
            }
          ]
        }
      ]

      result = render(json)

      expected = <<~HTML.squish
        <ul><li>One</li><li>Two</li></ul>
      HTML

      expect(result).to eql(expected)
    end

    it 'renders nested lists' do
      json = [
        {
          "style" => "normal",
          "_type" => "block",
          "listItem" => "bullet",
          "level" => 1,
          "children" => [
            {
              "_type" => "span",
              "marks" => [],
              "text" => "Aone"
            }
          ],
        },
        {
          "style" => "normal",
          "_type" => "block",
          "listItem" => "bullet",
          "level" => 2,
          "children" => [
            {
              "_type" => "span",
              "marks" => [],
              "text" => "Bone"
            }
          ]
        }
      ]

      result = render(json)

      expected = <<~HTML.squish
        <ul><li>Aone<ul><li>Bone</li></ul></li></ul>
      HTML

      expect(result).to eql(expected)
    end

    def render(json)
      described_class.new(json).to_html
    end
  end
end
