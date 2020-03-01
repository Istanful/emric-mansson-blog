class PortableText::Style::H1
  include PortableText::Style

  def render
    content_tag :h1, children, id: text_id
  end
end
