# frozen_string_literal: true

class PortableText::Child::Span
  include PortableText::Child

  def render
    marks.reduce(text) do |acc, mark|
      PortableText::Mark.render(mark, acc, mark_defs)
    end
  end
end
