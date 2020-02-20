class BlockContent::Block
  include ActionView::Helpers::OutputSafetyHelper
  include ActionView::Helpers::TagHelper

  attr_reader :content

  def initialize(content)
    @content = content
  end

  def render
    style.new(rendered_children).render
  end

  private

  def style
    "Style::#{content["style"].camelize}".constantize
  end

  def rendered_children
    mapped = children.map do |child|
      BlockContent.render(child)
    end

    safe_join mapped
  end

  def children
    content["children"]
  end
end
