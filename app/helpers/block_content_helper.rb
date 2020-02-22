# frozen_string_literal: true

module BlockContentHelper
  def block_content(content)
    BlockContent.render(content, [])
  end
end
