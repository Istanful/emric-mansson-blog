# frozen_string_literal: true

module BlockContentHelper
  def block_content(json)
    PortableText.new(json).to_html
  end
end
