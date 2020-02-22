# frozen_string_literal: true

class MarkDefinition::Link
  include MarkDefinition::Base
  include ActionView::Helpers::UrlHelper

  def render
    link_to content, definition["href"], class: 'text-blue'
  end
end
