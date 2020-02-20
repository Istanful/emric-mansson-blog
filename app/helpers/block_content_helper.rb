# frozen_string_literal: true

module BlockContentHelper
  def block_content(content)
    safe_join BlockContent.render(content)
  end
end
